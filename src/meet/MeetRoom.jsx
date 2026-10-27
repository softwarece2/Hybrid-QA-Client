import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import { Grid, Box, Typography } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useSelector } from "react-redux";
//helper
import { useSocket } from "../context";
import usePeer from "../hooks/usePeer";
import usePlayer from "../hooks/usePlayer";
import { useVideoRecorder } from "../hooks/useRecorderStream";
//component
import Player from "../cam-component/Player";
import Bottom from "../cam-component/Bottom";
//api
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

const MeetRoom = ({ roomId, setOpenRoom, checkedUsers, selectedUploadRow, rowData, stream }) => {
  const socket = useSocket();
  const loggedInUser =useSelector((store) => store.loggedInUser) || JSON.parse(localStorage.getItem("User"));

  const { peer, myId } = usePeer(roomId);
 
  const { startVideoRecording, stopVideoRecording, isRecording } = useVideoRecorder(stream);
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleHandRaise,
    toggleVideo,
    leaveRoom,
    startRecording,
    stopRecording,
    // toggleRecording,
  } = usePlayer(myId, roomId, peer, setOpenRoom);

  console.log(socket,stream,selectedUploadRow, rowData, "============================MEET ROOM==========================");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (socket?.readyState !== WebSocket.OPEN || !peer) return;
    
      const handleUserConnected = (newUser) => {
        console.log(`user connected in room with userId ${newUser}`);

        const call = peer.call(newUser, stream);
        console.log("calling...", call);

        if (call) {
          // if there is no streams
          setPlayers((prev) => ({
            ...prev,
            [newUser]: {
              url: "",
              muted: true,
              playing: false,
              handRaise: false,
            },
          }));

          setUsers((prev) => ({
            ...prev,
            [newUser]: call,
          }));

          call.on("stream", (incomingStream) => {
            console.log(`incoming stream from (calling) ${newUser}`);
            setPlayers((prev) => ({
              ...prev,
              [newUser]: {
                url: incomingStream,
                muted: true,
                playing: true,
                handRaise: false,
              },
            }));

            setUsers((prev) => ({
              ...prev,
              [newUser]: call,
            }));
          });
        }
      };
    

    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].muted = !copy[userId].muted;
          return { ...copy };
        } else {
          return prev;
        }
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].playing = !copy[userId].playing;
          return { ...copy };
        } else {
          return prev;
        }
      });
    };

    const handleHandRaise = (userId) => {
      console.log(`user with id ${userId} hand raised`);

      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].handRaise = !copy[userId].handRaise;
          return { ...copy };
        } else {
          return prev;
        }
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };

    const handleIncomingMessage = (message) => {
      const msg = JSON.parse(message.data);
      console.log(msg, "msg=>>>>>parsed" )

      if (msg.eventName === "user-connected" ) {
        handleUserConnected(msg.userId);
      }

      if (msg.eventName === "user-toggle-audio") {
        handleToggleAudio(msg.userId);
      }

      if (msg.eventName === "user-toggle-video") {
        handleToggleVideo(msg.userId);
      }

      if (msg.eventName === "user-toggle-hand-raise") {
        handleHandRaise(msg.userId);
      }

      if (msg.eventName === "user-leave") {
        handleUserLeave(msg.userId);
      }

      if (msg.eventName === "start-video-recording") {
        startVideoRecording(msg.userId);
      }

      if (msg.eventName === "stop-video-recording") {
        stopVideoRecording(msg.userId);
      }
    };

    socket.onmessage = handleIncomingMessage;

    // return () => {
    //   if (socket && socket.readyState === WebSocket.OPEN) {
    //     socket.close();
    //   }
    // };
  }, [
    peer,
    players,
    setPlayers,
    socket,
    startVideoRecording,
    stopVideoRecording,
    stream,
    users,
  ]);

  useEffect(() => {
    if (!peer) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);
      console.log("answering the call...", call);
      if (call) {
        call.on("stream", (incomingStream) => {
          console.log(`incoming stream from ${callerId}`);
          setPlayers((prev) => ({
            ...prev,
            [callerId]: {
              url: incomingStream,
              muted: true,
              playing: true,
              handRaise: false,
            },
          }));

          setUsers((prev) => ({
            ...prev,
            [callerId]: call,
          }));
        });
      }
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!myId) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream || "",
        muted: true,
        playing: !!stream,
        handRaise: false,
      },
    }));

    if (checkedUsers.length > 0 && loggedInUser && roomId && selectedUploadRow && rowData) {
      axiosInstance
        .post(
          "remoteInspection/sendWebcamLink",
          checkedUsers.map((el) => +el),
          {
            params: {
              meetingId: roomId,
              empName: loggedInUser.eName,
              olId:rowData.offerLetterId,
              testId:selectedUploadRow.applicableTestId,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch(console.log);
    }
  }, [myId, setPlayers, stream, checkedUsers, roomId, loggedInUser, selectedUploadRow, rowData]);

  // console.log(playerHighlighted, nonHighlightedPlayers);

  return (
    <Box display="flex" justifyContent="center" padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            style={{
              border: "2px solid aliceblue",
              borderRadius: 4,
              height: "100%",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Main Video
            </Typography>
            {playerHighlighted ? (
              <div style={{ position: "relative" }}>
                <Player
                  url={playerHighlighted.url}
                  muted={playerHighlighted.muted}
                  playing={playerHighlighted.playing}
                  handRaise={playerHighlighted.handRaise}
                  startRecording={() => {
                    startRecording();
                  }}
                  stopRecording={() => {
                    stopRecording();
                  }}
                  isActive
                />
                <Bottom
                  muted={playerHighlighted.muted}
                  playing={playerHighlighted.playing}
                  handRaise={playerHighlighted.handRaise}
                  toggleHandRaise={toggleHandRaise}
                  toggleAudio={toggleAudio}
                  toggleVideo={toggleVideo}
                  leaveRoom={leaveRoom}
                />
              </div>
            ) : (
              <Box
                style={{
                  display: "flex",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                <AccountCircle
                  style={{
                    fontSize: 400,
                    color: "gray",
                    marginTop: "auto",
                    height: "100%",
                  }}
                />
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={4}>
          <div
            style={{
              height: "calc(100vh - 200px)",
              overflow: "auto",
              border: "2px solid aliceblue",
              borderRadius: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Other Participants
            </Typography>
            {Object.keys(nonHighlightedPlayers).map((playerId) => {
              const { url, muted, playing, handRaise } =
                nonHighlightedPlayers[playerId];
              return (
                <Player
                  key={playerId}
                  url={url}
                  muted={muted}
                  playing={playing}
                  handRaise={handRaise}
                  isActive={false}
                  startRecording={() => {
                    startRecording();
                  }}
                  stopRecording={() => {
                    stopRecording();
                  }}
                  isRecording={isRecording}
                />
              );
            })}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeetRoom;

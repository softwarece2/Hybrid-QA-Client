import {
    Button,
    Grid,
    List,
    ListItem,
    Paper,
    TextField,
    Typography
  } from "@material-ui/core";
  import { makeStyles } from "@material-ui/core/styles";
  import SendIcon from "@material-ui/icons/Send";
  import moment from "moment";
  import axiosInstanceMaster from "pages/Services/AxiosInstance.js";
  import { useEffect, useRef, useState } from "react";
  import { useSelector } from "react-redux";
  import Socket from "react-stomp";
  import UserList from "./UserList.jsx";
  import { TRANSACTION_CHAT_URL } from "config.js";
  import { toast } from "react-toastify";
  
  const useStyles = makeStyles((theme) => ({
    icon: {
      color: theme.palette.primary.dark,
    },
    chatSection: {
      width: "100%",
      height: "50vh",
    },
    headBG: {
      backgroundColor: theme.palette.background.default,
    },
    borderRight500: {
      borderRight: "1px solid #e0e0e0",
    },
    messageArea: {
      height: "40vh",
      overflowY: "auto",
    },
    textcolor: {
      color: theme.palette.background.light,
    },
    date: {
      color: theme.palette.background.light,
      fontSize: 10,
      marginLeft: 10,
      color: "#000",
    },
    receiveMessages: {
      wordBreak:'break-all',
      whiteSpace: "pre-wrap",
      position: "relative",
      marginRight: "200px",
      // marginBottom: "10px",
      padding: "10px",
      backgroundColor: theme.palette.primary.light,
      // width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: `1px solid ${theme.palette.primary.light}`,
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: `15px solid ${theme.palette.primary.light}`,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px",
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: `17px solid ${theme.palette.primary.light}`,
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px",
      },
    },
    sendMessages: {
      whiteSpace: "pre-wrap",
      position: "relative",
      wordBreak:'break-all',
      // marginLeft: "200px",
      // marginBottom: "10px",
      padding: "10px",
      backgroundColor: theme.palette.primary.main,
      // width: "60%",
      //height: "50px",
      textAlign: "left",
      // font: "400 .9em 'Open Sans', sans-serif",
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: `15px solid ${theme.palette.primary.main}`,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px",
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: `17px solid ${theme.palette.primary.main}`,
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px",
      },
    },
    hide: {
      display: "none",
    },
    messagesRight: {
      justifyContent: "flex-end",
    },
  }));
  
  export default function Chat() {
    const [selectedUser, setSelectedIndex] = useState(null);
    const [inputmessage, setInputMessage] = useState("");
    const userRef = useRef();
    const messageContenerRef = useRef();
    const [chatHistory, setChatHistory] = useState([]);
    const loginedUser =
      useSelector((store) => store.loggedInUser) ||
      JSON.parse(localStorage.getItem("User"));
  
    const [users, setUsers] = useState([]);
    const getActiveLogins = () => {
      axiosInstanceMaster("user/fetchAllActiveLoginUsers/")
        .then(({ data }) => {
          console.log(data)
          var filterLoginUser = data?.filter(
            (item) => item.id !== loginedUser.id
          );
          const resetUserCount = filterLoginUser.map((item) => {
            return {
              ...item,
              count: 0,
            };
          });
          setUsers(resetUserCount);
        })
        .catch(console.log)
        .finally(() => console.log(""));
    };
    useEffect(() => {
      getActiveLogins();
      setChatHistory(JSON.parse(localStorage.getItem("chatHistory")) ?? []);
    }, []);
  
    useEffect(() => {
      messageContenerRef?.current?.scroll({
        top: messageContenerRef?.current?.scrollHeight,
        behavior: "smooth",
      });
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }, [chatHistory]);
  
    useEffect(() => {
      messageContenerRef?.current?.scroll({
        top: messageContenerRef?.current?.scrollHeight,
        behavior: "instant",
      });
    }, [selectedUser]);
  
    const classes = useStyles();
  
    const handleListItemClick = (id) => {
      setSelectedIndex(id);
      const resetUserCount = users.map((item) => {
        return id === item.id
          ? {
              ...item,
              count: 0,
            }
          : {
              ...item,
            };
      });
  
      setUsers(resetUserCount);
    };
  
    function onMessageSubmit() {
      if (!inputmessage.trim()) {
        toast.info("Please type a message.");
        return;
      }
    
      if (selectedUser === null) {
        toast.info("Please select a user to chat with.");
        return;
      }
    
      if (inputmessage.length > 500) {
        toast.info("Message is too long. Maximum 500 characters allowed.");
        return;
      }
    

      var obj = {
        message: inputmessage.trim(),
        sender: loginedUser?.id,
        receivers: [selectedUser],
        timestamp: moment().format("MM/DD HH:mm"),
        messageType:'chatMessage'
      };
  
      userRef.current.sendMessage("/app/private-message", JSON.stringify(obj));
      setChatHistory([...chatHistory, obj]);
      setInputMessage("");
    }
    return (
      <>
        <Socket
          url={`${TRANSACTION_CHAT_URL}olms-websocket`}
          topics={["/user/" + loginedUser?.id + "/private"]}
          onConnect={() => console.log("------chat connected -----")}
          onDisconnect={() => console.log("---------disconnected--------------")}
          onMessage={(msg) => {
            msg.timestamp = moment().format("MM/DD HH:mm");
            setChatHistory([...chatHistory, msg]);
            const updateUserCount = users?.map((item) => {
              return item?.id === msg.sender && item?.id !== selectedUser
                ? { ...item, count: item.count + 1 }
                : { ...item };
            });
            setUsers(updateUserCount);
          }}
          ref={(ss) => {
            userRef.current = ss;
          }}
        />

        <Grid container component={Paper}>
          <Grid item xs={12} style={{ backgroundColor: "aliceblue", paddingLeft: 16 }}>
            <Typography variant="h6">Chat</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} style={{ border: "1px solid aliceblue", borderTop: "none" }}>
            <UserList indianNames={users} handleListItemClick={handleListItemClick} selectedUser={selectedUser} />
          </Grid>

          <Grid
            container
            item
            xs={12}
            sm={12}
            md={9}
            lg={9}
            style={{ border: "1px solid aliceblue", borderLeft: "none", borderTop: "none" }}
          >
            <Grid item xs={12} className={classes.headBG}>
              <List className={classes.messageArea} ref={messageContenerRef}>
                {chatHistory
                  .filter((item) => item.sender == selectedUser || item.receivers[0] === selectedUser)
                  .map((item, index) => (
                    <>
                      {item.sender === loginedUser.id ? (
                        <>
                          <ListItem
                            key={index}
                            className={classes.messagesRight}
                            style={{
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            <div className={classes.sendMessages}>
                              <Typography align="left" className={classes.textcolor}>
                                {item.message}
                              </Typography>
                            </div>
                            <Typography align="left" className={classes.date}>
                              {moment(item.timestamp).format("hh:mm A")}
                            </Typography>
                          </ListItem>
                        </>
                      ) : (
                        <>
                          <ListItem
                            key={index}
                            style={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            {/* <Grid container>
                        <Grid item xs={12} className={classes.sendMessages}> */}
                            <div className={classes.receiveMessages}>
                              <Typography align="left" className={classes.textcolor}>
                                {item.message}
                              </Typography>
                            </div>

                            <Typography align="left" variant="body2" className={classes.date}>
                              {moment(item.timestamp).format("hh:mm A")}
                            </Typography>
                          </ListItem>
                        </>
                      )}
                    </>
                  ))}
              </List>
            </Grid>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                padding: "8px",
                border: "1px solid aliceblue",
                backgroundColor: "#f9f9f9",
                gap: "8px",
                width: "100%",
              }}
            >
              <textarea
                placeholder="Type your message..."
                rows={1}
                style={{
                  flex: 1,
                  resize: "none",
                  border: "none",
                  outline: "none",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  minHeight: "36px",
                  maxHeight: "150px",

                  overflowY: "auto",
                }}
                value={inputmessage}
                onChange={(e) => setInputMessage(e.target.value)}
              ></textarea>

              <button
                onClick={onMessageSubmit}
                style={{
                  backgroundColor: "#317fb3",
                  border: "none",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "36px",
                }}
                title="Send"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="white">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
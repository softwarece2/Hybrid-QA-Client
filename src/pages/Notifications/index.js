import { Card, CardContent, Container, Box, Typography } from "@material-ui/core";
import React from "react";
import AxiosInstance from "../Services/AxiosInstance";

const Notifications = () => {
  const [notificationsData, setNotificationsData] = React.useState([]);
 


  const [user] = React.useState(JSON.parse(localStorage.getItem("User")));

  React.useEffect(() => {
    AxiosInstance.get(`/notification/getNotificationsByUserId/${user.id}`)
      .then((response) => {
        response.data.forEach((item) => {
          const notification = { ...item, read: true };
          if (!item.read) {
            AxiosInstance.put(`notification/update/`, notification)
              .then((response) => {})
              .catch((e) => console.log(e.message));
          } else {
            setNotificationsData([item]);
          }
        });
      })
      .catch((e) => console.log(e.message));
  }, [user.id]);

  return (
    <Container maxWidth="lg" component={Box} mt={4} >
      <Typography variant="h4" color="primary">
        Notifications
      </Typography>
 
      {notificationsData.map((item) => {
        return (
          <Card style={{ border: "1px solid lightgray",marginBottom:12 }}>
            <CardContent>
              <Typography variant="h7" color="primary" style={{ fontWeight: "550" }}>
                {item.title}
              </Typography>

              <Typography variant="body1">{item.message}</Typography>

              <Typography variant="body2">{item.date}</Typography>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
};

export default Notifications;

import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import cblogo from "./cblogo.PNG";

const axios = require("axios").default;

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  center: {
    width: "60%",
  },
  bottom: {
    margin: "auto",
    width: "50%",
  },
  previewText: {
    width: "100%",
    marginTop: "20px",
  },
  imgPreview: {
    textAlign: "center",
    margin: "5px 15px",
    height: "400px",
    width: "100%",
    borderLeft: "1px solid gray",
    borderRight: "1px solid gray",
    borderTop: "5px solid gray",
    borderBottom: "5px solid",
  },
  img: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    height: "400px",
    width: "50%",
  },
  card: {
    marginTop: "20px",
    border: "1px solid black",
  },
  uploadButton: {
    marginLeft: "50px",
  },
});

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  let confidence = 0;
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
    setData(undefined);
    setImage(true);
  };
  async function sendFile() {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
    }
  }

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            CodeBasics: Potato Disease Classification
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo}></Avatar>
        </Toolbar>
      </AppBar>
      <Container className={classes.center}>
        {!image && (
          <div className={classes.imgPreview}>
            <div className={classes.previewText}>
              Please select an Image for Preview
            </div>
          </div>
        )}
        {image && <img src={preview} className={classes.img} />}
        <br />
        <div className={classes.bottom}>
          <input type="file" onChange={onSelectFile} />
          <Button
            onClick={sendFile}
            variant="contained"
            color="primary"
            className={classes.uploadButton}
          >
            Process
          </Button>
          {data && (
            <Card className={classes.card}>
              <CardContent>
                <p>Condition: {data.class}</p>
                <p>Confidence: {confidence}%</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
};

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
import { Paper, CardActionArea, CardMedia, CardActions, Grid, IconButton } from "@material-ui/core";
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/styles'
// import { ThemeProvider } from '@material-ui/styles';
// import { createMuiTheme } from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import Image from '@material-ui/icons/Image';
import cblogo from "./cblogo.PNG";
import image from "./bg.png";
import leaf from "./leaf.jpg";
import { height } from "@material-ui/system";


const axios = require("axios").default;

// const whiteTheme = createMuiTheme({ palette: { primary: white } })

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  // center: {
  //   marginTop: "3vh",
  //   width: "60%",
  // },
  // bottom: {
  //   margin: "auto",
  //   width: "50%",
  // },
  // previewText: {
  //   width: "100%",
  //   marginTop: "20px",
  // },
  // imgPreview: {
  //   textAlign: "center",
  //   margin: "5px 15px",
  //   height: "400px",
  //   // width: "100%",
  //   borderLeft: "1px solid gray",
  //   borderRight: "1px solid gray",
  //   borderTop: "5px solid gray",
  //   borderBottom: "5px solid",
  // },
  // img: {
  //   display: "block",
  //   marginLeft: "auto",
  //   marginRight: "auto",
  //   width: "50%",
  // },
  // card: {
  //   marginTop: "3vh",
  //   border: "1px solid black",
  //   marginBottom: "3vh",
  // },
  // uploadButton: {
  //   marginTop: "20px",
  // },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  paperContainer: {
    // backgroundImage: `url(${Image})`,
    height: "inherit",
    flexGrow: 1,
  },
  gridContainer: {
    flexGrow: 1,
    height: 'inherit',
    justifyContent: "center",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
  },
  imageCard: {
    margin: "auto",
    width: 400,
    height: 500,
    backgroundColor: 'transparent',
    // marginTop: "3vh",
    //   border: "1px solid black",
    //   marginBottom: "3vh",
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  //   detail {
  //   flex: 1,
  //   justifyContent: ''
  // }
}));
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

  useEffect(() => {
    if (!image) {
      return;
    }
    sendFile();
  }, [preview]);

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
  const sendFile = async () => {
    console.log('hiya', image);
    if (image) {
      console.log('hiya');
      let formData = new FormData();
      formData.append("file", selectedFile);
      console.log('here', selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      console.log('hiya', res);
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
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          // justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Card className={classes.imageCard}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  Please select an Image to Process
                </Typography>
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <Typography variant="span">Condition     </Typography>
                <Typography variant="span">Confidence</Typography>
                {/* <Typography variant="h5">Confidence: {confidence}%</Typography> */}
                {/* <Typography variant="h5">Condition: {data.class}</Typography> */}
                <Typography variant="span">{data.class} </Typography>
                <Typography variant="span">{confidence}%</Typography>

              </CardContent>}
            </Card>
          </Grid>
          <Grid item>
            <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={onSelectFile} />
            <label htmlFor="icon-button-file">
              {/* <ThemeProvider theme={whiteTheme}> */}

              <Button variant="contained" className={classes.uploadButton} color="primary" component="span" size="large" startIcon={<Image fontSize="large" onClick={sendFile} />}>
                Upload
              </Button>
              {/* </ThemeProvider> */}
            </label>
          </Grid>
        </Grid>
        {/* </Paper> */}
        {/* </div> */}
        {/* {!image && (
              <div className={classes.imgPreview}>
                <div className={classes.previewText}>
                  Please select an Image to Process
                </div>
              </div>
            )}
            {image && <img src={preview} className={classes.img} />}
            <br />
            <div className={classes.bottom}>
              <input type="file" onChange={onSelectFile} /><br />
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
            </div> */}

        {/* </Paper> */}
        {/* </Paper> */}
      </Container>
    </React.Fragment>
  );
};

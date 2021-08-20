import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import Image from '@material-ui/icons/Image';
import cblogo from "./cblogo.PNG";
import image from "./bg.png";
import { common } from '@material-ui/core/colors';



const axios = require("axios").default;


const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: '#be6a77',
    '&:hover': {
      backgroundColor: '#be6a77c9',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  uploadButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "white",
    fontSize: "20px",
    fontWeight: 900,
  },
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
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
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
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'white',
  },
  appbar: {
    background: '#be6a77',
    boxShadow: 'none',
    color: 'white'
  }
}));
export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  let confidence = 0;

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
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
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

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
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
          justifyContent="center"
          alignItems="center"
          spacing={2}
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
                <Typography component="h5" variant="h5" color="white" className={classes.text}>
                  Please select an Image to Process
                </Typography>
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableCell1}>Label:</TableCell>
                        <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      <TableRow className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          {data.class}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
            </Card>
          </Grid>
          <Grid item className={classes.buttonGrid} >
            <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={onSelectFile} />
            <label htmlFor="icon-button-file">

              <ColorButton variant="contained" className={classes.uploadButton} color="primary" component="span" size="large" startIcon={<Image fontSize="large" onClick={sendFile} />}>
                Upload
              </ColorButton>
            </label>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

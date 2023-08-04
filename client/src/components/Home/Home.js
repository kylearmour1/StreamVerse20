import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../utils/auth";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MuiSearch from '../MuiSearch/MuiSearch';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import  "./Home.css";

const ShareDialog = ({ open, handleClose, video }) => {
  if (!video) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Share this video</DialogTitle>

      <DialogContent>
        <div className="share-button">
          <Button variant="contained">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${video.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on Facebook
            </a>
          </Button>
        </div>
        <div className="share-button">
          <Button variant="contained">
            <a
              href={`https://twitter.com/intent/tweet?text=${video.title}&url=${video.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on Twitter
            </a>
          </Button>
        </div>
        <div className="share-button">
          <Button variant="contained">
            <a
              href={`mailto:?subject=${video.title}&body=Check out this video: ${video.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share via Email
            </a>
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const HomePage = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVideos();
    checkAuthStatus();
  }, []);

  const fetchVideos = () => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const maxResults = 1;

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${searchQuery}&key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const videos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        }));
        setUploadedVideos(videos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    fetchVideos();
};


  const handleSearchQueryChange = (value) => {
    setSearchQuery(value);
  };

  const checkAuthStatus = () => {
    setLoggedIn(AuthService.loggedIn());
  };

  const openShareDialog = (video) => {
    if (!loggedIn) {
      return;
    }
    setSelectedVideo(video);
    setShareDialogOpen(true);
  };

  const closeShareDialog = () => {
    setSelectedVideo(null);
    setShareDialogOpen(false);
  };

  return (
    <>
    {/* <Header>
      <Link to="/streamverse">Go to StreamVerse</Link>
      <div className="search-bar">
        <MuiSearch 
          searchQuery={searchQuery} 
          onSearchQueryChange={handleSearchQueryChange} 
          onSearchSubmit={handleSearch}
        />
      </div>
    </Header> */}

<Header>
        <Link to="/streamverse">Go to StreamVerse</Link>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </Header>
      
      <div>
  
<MuiSearch 
  searchQuery={searchQuery} 
  onSearchQueryChange={handleSearchQueryChange} 
  onSearchSubmit={handleSearch} 
/>




</div>


      

     

      <div className="container">
        <main className="main-content">
          <section className="section">
            <h2>About StreamVerse</h2>
            <p>
              Welcome to StreamVerse, the ultimate destination for video sharing
              and streaming! Our platform is designed with your needs in mind,
              offering a seamless experience for registration, uploading,
              viewing, interaction, and sharing of videos. Inspired by the best
              features of popular video sharing platforms, StreamVerse boasts a
              polished and user-friendly interface that makes navigating the
              site a breeze. We prioritize your security and privacy, ensuring
              that your personal information is protected. Whether you're a
              content creator looking to share your talents with the world or a
              viewer seeking high-quality videos, StreamVerse is here to make
              your experience enjoyable and hassle-free. Join us today and
              become a part of our vibrant community of creators and viewers,
              where your passion for videos comes to life.
            </p>
            <section className="section">
              <h2>Upload</h2>
              <div>
                <Tooltip
                  title={loggedIn ? "" : "Please log in to upload videos"}
                >
                  <span>
                    <a
                      href={loggedIn ? "https://www.youtube.com/upload" : ""}
                      target={loggedIn ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="contained"
                        disabled={!loggedIn}
                        className="upload-button"
                      >
                        Upload to YouTube
                      </Button>
                    </a>
                  </span>
                </Tooltip>
              </div>
            </section>
          </section>

          <section className="section">
        <h2>Trending</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="featured-streams">
            {uploadedVideos.map((video) => (
              <div className="stream-card-trending" key={video.id}>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <iframe
                  title={video.title}
                  src={video.videoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <Button
                  variant="contained"
                  onClick={() => openShareDialog(video)}
                >
                  Share
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
        
        </main>
      </div>
      <ShareDialog
        open={shareDialogOpen}
        handleClose={closeShareDialog}
        video={selectedVideo}
      />
      <Footer />
    </>
  );
};

export default HomePage;


















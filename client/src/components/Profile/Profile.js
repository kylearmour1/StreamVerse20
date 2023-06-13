


import React, { useEffect, useState } from "react";
import AuthService from "../../utils/auth";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./Profile.css";

const ShareDialog = ({ open, handleClose, video }) => {
  if (!video) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Share this video</DialogTitle>
      <DialogContent>
        <div className="share-button">
          <Button variant="contained">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${video.videoUrl}`} target="_blank" rel="noopener noreferrer">
              Share on Facebook
            </a>
          </Button>
        </div>
        <div className="share-button">
          <Button variant="contained">
            <a href={`https://twitter.com/intent/tweet?text=${video.title}&url=${video.videoUrl}`} target="_blank" rel="noopener noreferrer">
              Share on Twitter
            </a>
          </Button>
        </div>
        <div className="share-button">
          <Button variant="contained">
            <a href={`mailto:?subject=${video.title}&body=Check out this video: ${video.videoUrl}`} target="_blank" rel="noopener noreferrer">
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

const Profile = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      window.location.assign('/');
    } else {
      fetchVideos('trending');
    }
    checkAuthStatus();
  }, []);

  const fetchVideos = (query) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const maxResults = 6;

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&key=${apiKey}`
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

  const checkAuthStatus = () => {
    setLoggedIn(AuthService.loggedIn());
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchVideos(searchQuery);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
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
      <Header>
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
      <div className="search-bar" style={{ backgroundColor: 'red', padding: '10px', borderRadius: '5px' }}>
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchQuery}
        onChange={handleSearchQueryChange}
        style={{ marginRight: '10px' }}
      />
      <button type="submit">Search</button>
    </form>
  </div>
      <div className="container">
        <Sidebar />
        <main className="main-content">
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
                    <Button variant="contained" onClick={() => openShareDialog(video)}>
                      Share
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <ShareDialog open={shareDialogOpen} handleClose={closeShareDialog} video={selectedVideo} />
      <Footer />
    </>
  );
};

export default Profile;




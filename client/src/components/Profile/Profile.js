
import React, { useEffect, useState } from "react";
import AuthService from "../../utils/auth";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MuiSearch from '../MuiSearch/MuiSearch';
import { PersistentSlideRight } from "../PersistentSlideRight/PersistentSlideRight";
import "./Profile.css";
import Footer from '../Footer/Footer';

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

const Profile = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      window.location.assign("/");
    } else {
      fetchVideos();
    }
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
    <div>
      <PersistentSlideRight />  
      <div>
        <MuiSearch 
          searchQuery={searchQuery} 
          onSearchQueryChange={handleSearchQueryChange} 
          onSearchSubmit={handleSearch} 
        />
      </div>
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
      <ShareDialog
        open={shareDialogOpen}
        handleClose={closeShareDialog}
        video={selectedVideo}
      />
      <Footer />
    </div>
  );
};

export default Profile;

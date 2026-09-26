fetch('http://localhost:3000/api/admin/gallery/img-1790352036445', { method: 'DELETE' })
  .then(res => res.json().then(data => console.log(data)))
  .catch(err => console.error(err));

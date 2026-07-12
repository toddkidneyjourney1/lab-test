const castData = [
  { name: "Samuel Kirk", role: "Vladimir", photo: "samuel-kirk.jpg", bio: "bios.html#samuel" },
  { name: "Marcus Chen", role: "Estragon", photo: "marcus-chen.jpg", bio: "bios.html#marcus" },
  { name: "James Richardson", role: "Pozzo", photo: "james-richardson.jpg", bio: "bios.html#james" },
  { name: "David Park", role: "Lucky", photo: "david-park.jpg", bio: "bios.html#david" }
];

function loadCast() {
  const grid = document.getElementById('cast-grid');
  if (!grid) return;
  
  grid.innerHTML = castData.map(member => `
    <div class="cast-card">
      <img src="assets/cast/${member.photo}" alt="${member.name}" class="cast-photo">
      <span class="cast-name">${member.name}</span>
      <span class="role">${member.role}</span>
      <a href="${member.bio}" class="bio-link">View Bio</a>
    </div>
  `).join('');
}

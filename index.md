---
layout: default
title: Alien Gallery
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alien Gallery | The Laboratory Theater of Florida</title>
    <style>
        /* Base Styles */
        body { margin: 0; font-family: sans-serif; background-color: #1a1a1a; color: #fff; }

        /* Left-aligned Header */
        .main-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 1rem 2rem;
            background-color: #1a1a1a;
            border-bottom: 1px solid #333;
        }
        .logo { font-size: 1.5rem; font-weight: bold; margin-right: auto; }
        .logo a { color: #fff; text-decoration: none; }
        .logo span { color: #ff3366; }

        /* Masonry-style Grid for variable sizes */
        .photo-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            grid-auto-rows: 250px;
            grid-auto-flow: dense;
            gap: 15px;
            padding: 20px;
        }
        .photo-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }
        .photo-item:hover { transform: scale(1.02); }
        .photo-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Variable sizes */
        .wide { grid-column: span 2; }
        .tall { grid-row: span 2; }

        /* Hamburger Nav (Simplified) */
        .nav-toggle-label { cursor: pointer; color: #ff3366; font-size: 1.5rem; }
    </style>
</head>
<body>

    <header>
        <div class="logo">
            THE <span>LAB</span>
            <p class="tagline">Intentionally innovative live theater</p>
        </div>
    </header>
    <main>
        <div class="photo-gallery">
            <div class="photo-item wide"><img src="assets/alien.JPG" alt="Alien Production 1"></div>
            <div class="photo-item"><img src="assets/alien4.JPG" alt="Alien Production 2"></div>
            <div class="photo-item tall"><img src="assets/alien2.JPG" alt="Alien Production 3"></div>
            <div class="photo-item"><img src="assets/alien3.JPG" alt="Alien Production 4"></div>
        </div>
    </main>

</body>
</html>

-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Värd: localhost:3306
-- Tid vid skapande: 10 mars 2022 kl 17:54
-- Serverversion: 5.7.24
-- PHP-version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `photo_api`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `albums`
--

INSERT INTO `albums` (`id`, `title`, `user_id`) VALUES
(1, 'Grand Line', 1),
(2, 'Luffy\'s Attacks', 1),
(3, 'Zoro\'s attacks', 2),
(4, 'Sanji\'s attacks', 3);

-- --------------------------------------------------------

--
-- Tabellstruktur `albums_photos`
--

CREATE TABLE `albums_photos` (
  `id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  `album_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `albums_photos`
--

INSERT INTO `albums_photos` (`id`, `photo_id`, `album_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 3),
(5, 5, 4);

-- --------------------------------------------------------

--
-- Tabellstruktur `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `title` varchar(250) DEFAULT NULL,
  `url` varchar(250) NOT NULL,
  `comment` varchar(250) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `photos`
--

INSERT INTO `photos` (`id`, `title`, `url`, `comment`, `user_id`) VALUES
(1, 'Grand Line image', 'https://static.wikia.nocookie.net/onepiece/images/4/41/Grand_Line_Infobox.png/revision/latest/scale-to-width-down/350?cb=20130315230507', 'Dangerous departure', 1),
(2, 'Gomu Gomu no Bazooka', 'https://static.wikia.nocookie.net/onepiece/images/1/1a/Gomu_Gomu_no_Bazooka.png/revision/latest/scale-to-width-down/210?cb=20130315012915', 'Luffy stretches both his arms far back, and then hurls them forward, striking his opponent with both instantaneously with a double open palm strike with both hands, that frequently sends the recipient(s) flying off the other direction.', 1),
(3, 'Gomu Gomu no Rifle', 'https://static.wikia.nocookie.net/onepiece/images/3/3d/Gomu_Gomu_no_Rifle.png/revision/latest/scale-to-width-down/210?cb=20120524053608', 'Luffy twists his arm around as he stretches it behind him and hits the opponent at close range.', 1),
(4, 'Two sword style: Toro Samon', 'https://static2.cbrimages.com/wordpress/wp-content/uploads/2019/09/Toro-Samon-Cropped.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5', ' Zoro assumes a stance with two of his swords held horizontally across his body, before launching himself at his opponent at an insane speed. He then launches a diagonal air slash at the target.', 2),
(5, 'French Fries Assortment', 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/10/sanji-fries-assortment.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5', 'Sanji launches three simultaneous kicks in three different directions.', 3);

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(250) NOT NULL,
  `first_name` varchar(250) DEFAULT NULL,
  `last_name` varchar(250) DEFAULT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`) VALUES
(1, 'Monkeydluffy@gmail.com', 'Luffy', 'Monkey D.', '$2b$10$6A3Aw33.reH8VBLBU3T3xev2mOjqx37tivLVlZLuDcBDjHgz7YUnG'),
(2, 'Lolonoazoro@gmail.com', 'Zoro', 'Lolonoa', '$2b$10$HDE3JOzC9XJegO2FsiP9LuqC4KEMyCRFSjcGpDTYLjH3tms31gs.a'),
(3, 'Sanji@gmail.com', 'Vinsmoke', 'Sanji', '$2b$10$X2fLGs46Em0tAgQBiHiXa.vASc4hPWDck3kBPqODdPJ.x9QP8A1tG');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index för tabell `albums_photos`
--
ALTER TABLE `albums_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `photo_id` (`photo_id`),
  ADD KEY `album_id` (`album_id`);

--
-- Index för tabell `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT för tabell `albums_photos`
--
ALTER TABLE `albums_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT för tabell `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Restriktioner för tabell `albums_photos`
--
ALTER TABLE `albums_photos`
  ADD CONSTRAINT `albums_photos_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`),
  ADD CONSTRAINT `albums_photos_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`);

--
-- Restriktioner för tabell `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

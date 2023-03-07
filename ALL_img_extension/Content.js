let willSmit = [
  "img\Funny-Tweets-About-Smith-Genie-Aladdin-Trailer.webp",
  "img\size_960_16_9_will_smith_ator3 (1).webp",
  "img\TechCrunch_Disrupt_2019_(48834434641)_(cropped).jpg",
  "img\will-smith-4-e1534947669898.webp",
  "img\will-smith-1594320007897_v2_450x337.jpg",
  "img\will-smith-foto.jpg",
];

const imgs = document.getElementsByTagName("img");

for (let i = 0; i < imgs.length; i++) {
  const randomImg = Math.floor(Math.random() * willSmit.length);
  imgs[i].src = willSmit[randomImg];
}

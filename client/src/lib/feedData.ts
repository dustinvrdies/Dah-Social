import { Post } from "./postTypes";

export const initialFeed: Post[] = [
  {
    id: "p1",
    type: "text",
    user: "dah",
    content: "Welcome to DAH Social. Build your profile. Post your world."
  },
  {
    id: "v1",
    type: "video",
    user: "dustin",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "First DAH video post."
  },
  {
    id: "m1",
    type: "listing",
    user: "seller1",
    title: "Used iPhone 12 (Good condition)",
    price: 250,
    location: "Local pickup",
    media: ""
  },
  {
    id: "p2",
    type: "text",
    user: "admin",
    content: "Minors (13-17) earn double DAH Coins: half now, half locked for college."
  }
];

export const videoOnlyFeed = initialFeed.filter(p => p.type === "video");
export const mallOnlyFeed = initialFeed.filter(p => p.type === "listing");

import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import image1 from "../assets/book1.png";
import image2 from "../assets/book2.png";
import image3 from "../assets/book3.png";
import image4 from "../assets/book4.png";
import image5 from "../assets/book5.png";
import talk from "../assets/talk.png";
import collab from "../assets/collab.png";
import bulb from "../assets/bulb.png";
import NotesCard from "../components/NotesCard";
import Section from "../components/layout/Section";
import Grid from "../components/layout/Grid";

const categories = [
  { branch: "Computer Science", image: image1 },
  { branch: "Electrical and communication", image: image5 },
  { branch: "Mechanical Engineering", image: image2 },
  { branch: "Civil Engineering", image: image4 },
  { branch: "MBA / Management", image: image3 },
  { branch: "Pharmacy", image: image1 },
  { branch: "Humanities", image: image3 },
  { branch: "Aptitude & Interview Prep", image: image1 },
];

const Home = () => {
  const navigate = useNavigate();
  const notes = useSelector((state) => state.note.notes);

  return (
    <>
      <Section className="pb-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-fluid-hero font-semibold text-gray-900">Access Free Study Material Shared By Top Students</h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
              Earn points by uploading and use them to access quality resources shared by peers.
            </p>
            <button onClick={() => navigate("/upload")} className="focus-ring mt-7 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/50">
              Start Sharing Notes
            </button>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-xl">
            <div className="absolute left-2 top-2 h-[280px] w-[58%] overflow-hidden rounded-[2rem] shadow-xl sm:left-6">
              <img className="h-full w-full object-cover" src="https://terribullshop.com/cdn/shop/files/DA95D9B1-A123-4D25-8351-86660884569F.jpg?v=1739936833" alt="Student learning" loading="lazy" />
            </div>
            <div className="absolute right-2 bottom-4 h-[220px] w-[38%] overflow-hidden rounded-[2rem] shadow-xl sm:right-8">
              <img className="h-full w-full object-cover" src="https://plus.unsplash.com/premium_photo-1681505244718-68bb8ba65b6c?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Students collaborating" loading="lazy" />
            </div>
            <div className="absolute right-16 top-0 -z-10 h-56 w-56 rounded-full bg-blue-300/25 blur-2xl" />
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-fluid-title font-bold text-blue-700">Explore Notes By Subject</h2>
          <button onClick={() => navigate("/browse")} className="text-sm font-semibold text-blue-700 hover:text-blue-900">View all subjects →</button>
        </div>
        <Grid className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map(({ branch, image }) => (
            <button key={branch} onClick={() => navigate(`/${encodeURIComponent(branch)}`)} className="surface group flex min-h-24 items-center gap-4 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg">
              <img className="h-10 w-10" src={image} alt={branch} loading="lazy" />
              <span className="font-semibold text-gray-700 group-hover:text-blue-700">{branch}</span>
            </button>
          ))}
        </Grid>
      </Section>

      <Section>
        <Grid className="grid-cols-1 lg:grid-cols-2">
          <button onClick={() => navigate("/points")} className="surface flex flex-col items-center p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl font-bold">How Points Work</h3>
            <img className="my-3 h-40 object-contain" src={collab} alt="Points system" loading="lazy" />
            <span className="text-lg font-semibold text-blue-700">Learn More</span>
          </button>
          <div className="surface flex flex-col justify-between p-6">
            <h3 className="text-2xl font-bold">Student-Driven Learning Community</h3>
            <img src={talk} alt="Student community" className="mt-4 h-40 object-contain" loading="lazy" />
          </div>
        </Grid>
      </Section>

      <Section>
        <h2 className="text-fluid-title mb-8 font-bold text-blue-700">🌟 Top Rated Notes</h2>
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.slice(0, 8).map((note, index) => (
            <NotesCard note={note} key={index} />
          ))}
        </Grid>
      </Section>

      <Section>
        <div className="surface grid items-center gap-6 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
          <img className="mx-auto h-44 w-44 object-contain sm:h-52 sm:w-52" src={bulb} alt="Idea bulb" loading="lazy" />
          <div>
            <h2 className="text-fluid-title mb-5 font-semibold text-blue-700">Why Share Your Notes?</h2>
            <ul className="space-y-2 font-medium text-gray-700">
              <li>Earn points for every upload you make.</li>
              <li>Unlock access to top-rated notes from others.</li>
              <li>Build academic reputation and help peers.</li>
              <li>Quick and easy upload process.</li>
            </ul>
            <button onClick={() => navigate("/upload")} className="focus-ring mt-6 rounded-xl bg-blue-600 px-8 py-2.5 font-semibold text-white transition hover:bg-blue-700">Participate</button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Home;

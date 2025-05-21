import React from 'react'
import { motion } from 'framer-motion'


import image1 from '../assets/book1.png'
import image2 from '../assets/book2.png'
import image3 from '../assets/book3.png'
import image4 from '../assets/book4.png'
import image5 from '../assets/book5.png'
import talk from '../assets/talk.png'
import collab from '../assets/collab.png'
import group from '../assets/group.jpg'
import { useNavigate } from 'react-router-dom'
import bulb from '../assets/bulb.png'
import { useSelector } from 'react-redux'
import NotesCard from '../components/NotesCard'


const Home = () => {
  const navigate = useNavigate()
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

  const notes = useSelector((state) => state.note.notes)

  return (
    <div>

      {/* Hero Section */}
      <div className='pt-26 flex'>
        <div className="left w-1/2">
          <h1 className='text-5xl font-semibold text-gray-800 leading-15'>Access Free Study Material Shared By Top Students</h1>
          <p className='my-4 w-[70%]'>Earn points by uploading. Spend them to download valuable resources.</p>
          <button onClick={() => navigate('/upload')} className='px-12 py-2 mt-6 rounded-xl cursor-pointer hover:shadow-xl transition hover:shadow-blue-500/28 text-white bg-blue-600'>Start Sharing Notes</button>
        </div>
        <div className="right relative">
          <div className='w-74 h-96 overflow-hidden absolute left-18 -top-8 -z-1 rounded-full '>
            <img className='w-full h-full object-cover' src="https://terribullshop.com/cdn/shop/files/DA95D9B1-A123-4D25-8351-86660884569F.jpg?v=1739936833" alt="" />
          </div>
          <div className='w-44 h-61 absolute overflow-hidden left-80 top-28 rounded-full '>
            <img className='w-full h-full object-cover' src="https://plus.unsplash.com/premium_photo-1681505244718-68bb8ba65b6c?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className='absolute w-50 h-70 left-68 top-1 -z-2 bg-blue-300/40 rounded-full'></div>
        </div>
      </div>

      {/* Categories Section */}
      <div className='mt-26' >
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl text-blue-700 font-bold'>Explore Notes By Subject</h1>
          <p className='font-semibold'>View all subjects</p>
        </div>
        <div className='mt-18 grid cursor-pointer grid-cols-4 gap-8'>
          {categories.map(({ branch, image }, index) => (
            <div onClick={() => navigate(`/${encodeURIComponent(branch)}`)} key={index} className='h-20 bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 duration-300 px-7 transition-all shadow-md hover:shadow-xl flex gap-5 py-4 items-center rounded-xl bg-gray-100/48' >
              <img className='h-10' src={image} alt={branch} />
              <h1 className='text-lg leading-5 font-bold text-gray-700'>{branch}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* How Points Work Section */}
      <div className='mt-28 flex items-center gap-4' >
        <div onClick={() => navigate('/points')} className='left shadow-md hover:shadow-xl cursor-pointer w-1/2 py-8 px-8 active:scale-97 transition flex flex-col items-center rounded-2xl bg-gray-100/48'>
          <h1 className='text-3xl font-bold'>How Points Work</h1>
          <img className='m-2' src={collab} alt="collaboration" />
          <h1 className='text-2xl font-bold'>Learn More</h1>
        </div>
        <div className='right shadow-md hover:shadow-xl cursor-pointer w-1/2 py-8 px-16 text-start rounded-2xl bg-gray-100/48'>
          <h1 className='text-3xl font-bold'>Student-Driven <br />Learning community</h1>
          <img src={talk} alt="talk" />
        </div>
      </div>

      {/* Top Rated Notes Section */}
      <div className="mt-28 px-4">
          <h1 className="text-3xl font-bold text-blue-700 mb-10 w-fit">
           🌟 Top Rated Notes
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {notes.slice(0,8).map((note, index) => (
               <NotesCard note={note} key={index} />
           ))} 
          </div>
       </div>


      {/* Why Share Section */}
      <div className='mt-24 rounded-xl p-4 flex justify-between gap-16' >
        <div className='w-88'>
          <img className='w-full h-full object-cover' src={bulb} alt="share" />
        </div>
        <div className="bg-gry-100/48 px-16 pt-10 rounded-2xl">
          <h2 className="text-3xl mb-10 font-semibold text-blue-700">Why Share Your Notes?</h2>
          <div className="font-semibold text-gray-700 space-y-2">
            <h4>Earn points for every upload you make.</h4>
            <h4>Unlock access to top-rated notes from other toppers.</h4>
            <h4>Build your academic reputation and help your peers.</h4>
            <h4>Quick and easy upload process — less than 2 minutes.</h4>
            <h4>Completely free and student-powered platform.</h4>
          </div>
          <button onClick={() => navigate('/upload')} className='px-12 py-2 mt-8 rounded-xl cursor-pointer text-white bg-blue-600'>Participate</button>
        </div>
      </div>

      {/* Testimonials */}
      <div className='mt-28' >
        <h1 className='text-3xl text-blue-700 mb-10 font-bold'>What Students Say</h1>
        <div className='grid grid-cols-4 gap-4'>
          {[{ name: "Piyush Garg", college: "Lnct University", feedback: "This platform has been a game-changer for my studies. The resources are top-notch!" }, { name: "Shreya Gupta", college: "TIT University", feedback: "I love how easy it is to share and access notes. It's a true student-driven community." }, { name: "Sourya Raj", college: "MANIT Bhopal", feedback: "The point system is fantastic. It motivates me to contribute and helps me access great materials." }, { name: "Sonakshi Maurya", college: "Lncts Bhopal", feedback: "A brilliant initiative! Sharing notes has never been this rewarding and fun." }].map(({ name, college, feedback }, index) => (
            <div key={index} className='p-6 rounded-lg shadow-md hover:shadow-xl hover:shadow-blue-500/20 bg-gray-100/48 cursor-pointer hover:bg-[#6fb7ff]/10 transition'>
              <h2 className='text-xl font-bold text-blue-700'>{name}</h2>
              <h3 className='text-md text-gray-600'>{college}</h3>
              <p className='mt-4 text-gray-800'>{feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div  className='mt-26 mb-30'>
        <h1 className='text-3xl mb-10 text-blue-700 font-bold'>Frequently Asked Questions</h1>
        <div className="mt-10 space-y-6">
          {[{ question: "What is this platform about?", answer: "This platform allows students to share and access study materials for free, fostering a collaborative learning environment." }, { question: "How do I earn points?", answer: "You earn points by uploading your study materials. These points can be used to download resources shared by others." }, { question: "Is this platform free to use?", answer: "Yes, the platform is completely free and student-powered." }, { question: "What types of materials can I upload?", answer: "You can upload notes, study guides, and other academic resources that can help your peers." }, { question: "How secure is my data?", answer: "We prioritize your privacy and ensure that your data is secure and used only for the intended purposes." }].map(({ question, answer }, index) => (
            <div key={index} className="p-6 shadow-md bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 transition-all duration-300 hover:shadow-xl cursor-pointer rounded-lg bg-gray-100/48">
              <h2 className="text-lg font-semibold text-blue-700">{question}</h2>
              <p className="mt-2 text-gray-800">{answer}</p>
            </div>
          ))}
        </div>
      </div>

    </div>

  );
};

export default Home;

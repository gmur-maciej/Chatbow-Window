import React, { useState, useEffect } from 'react';
// Ensure index.css exists in your src directory and includes Tailwind directives
import './index.css';
import ChatWindow from './Chat/Chat';


// Mock Data (data.js)
const studyProgramsData = [
  {
    id: 1,
    name: 'Angewandte Pflegewissenschaft (dual)',
    degree: 'Bachelor',
    interest: 'Health and Social',
    nc: 'Open',
    start: 'Winter',
    form: 'Dual',
    campus: 'Zittau',
    shortDescription: 'Focuses on practical nursing science in a dual study model.',
    slug: 'angewandte-pflegewissenschaft-dual'
  },
  {
    id: 2,
    name: 'Automatisierung und Mechatronik',
    degree: 'Diplom',
    interest: 'IT and Technology',
    nc: 'Open',
    start: 'Winter',
    form: 'Full-time',
    campus: 'Görlitz',
    shortDescription: 'Combines automation and mechanical engineering principles.',
    slug: 'automatisierung-mechatronik'
  },
  {
    id: 3,
    name: 'Automatisierung und Mechatronik (Dual/KIA)',
    degree: 'Diplom',
    interest: 'IT and Technology',
    nc: 'Open',
    start: 'Winter',
    form: 'Dual',
    campus: 'Görlitz',
    shortDescription: 'Dual study program in automation and mechatronics.',
    slug: 'automatisierung-mechatronik-dual-kia'
  },
  {
    id: 4,
    name: 'Betriebswirtschaft',
    degree: 'Bachelor',
    interest: 'Management and Economics',
    nc: 'Open',
    start: 'Winter',
    form: 'Full-time',
    campus: 'Zittau',
    shortDescription: 'Provides a broad understanding of business administration.',
    slug: 'betriebswirtschaft'
  },
  {
    id: 5,
    name: 'Biotechnologie und angewandte Ökologie',
    degree: 'Master',
    interest: 'Nature and Environment',
    nc: 'Open',
    start: 'Winter',
    form: 'Full-time',
    campus: 'Zittau',
    shortDescription: 'Advanced studies in biotechnology and applied ecology.',
    slug: 'biotechnologie-angewandte-oekologie'
  },
  // Add more mock data here
];

// Header Component (Header.js)
function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Replace with actual logo */}
          <div className="h-10 w-10 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xl font-bold text-gray-800">Hochschule Zittau/Görlitz</span>
        </div>
        {/* Navigation will be handled by the Navigation component */}
      </div>
    </header>
  );
}

// Navigation Component (Navigation.js)
function Navigation({ onNavigate }) {
  return (
    <nav className="bg-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <ul className="flex space-x-4">
          <li><button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-gray-800">Hochschule</button></li>
          <li><button onClick={() => onNavigate('study-programs')} className="text-gray-800 font-semibold">Studium</button></li>
          <li><button onClick={() => onNavigate('international')} className="text-gray-600 hover:text-gray-800">International</button></li>
          <li><button onClick={() => onNavigate('research')} className="text-gray-600 hover:text-gray-800">Forschung</button></li>
          <li><button onClick={() => onNavigate('lifelong-learning')} className="text-gray-600 hover:text-gray-800">Lebenslanges Lernen</button></li>
        </ul>
      </div>
    </nav>
  );
}

// StudyProgramCard Component (StudyProgramCard.js)
function StudyProgramCard({ program, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{program.name}</h3>
          <p className="text-gray-600">{program.degree}</p>
        </div>
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isOpen && (
        <div className="mt-4 text-gray-700">
          <p>{program.shortDescription}</p>
          {/* Add more details here if available in data */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card from closing when clicking the button
              onNavigate('program-detail', program.slug);
            }}
            className="mt-2 text-blue-600 hover:underline"
          >
            Mehr erfahren
          </button>
        </div>
      )}
    </div>
  );
}

// StudyProgramList Component (StudyProgramList.js)
function StudyProgramList({ programs, onNavigate }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Deine Ergebnisse</h2>
      {programs.map(program => (
        <StudyProgramCard key={program.id} program={program} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

// StudyProgramsPage Component (StudyProgramsPage.js)
function StudyProgramsPage({ onNavigate }) {
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    degree: '',
    interest: '',
    nc: '',
    start: '',
    form: '',
    campus: '',
    search: ''
  });

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    // In a real application, fetch data from an API or CMS
    // For now, use mock data
    const filteredPrograms = studyProgramsData.filter(program => {
      return (
        (filters.degree === '' || program.degree === filters.degree) &&
        (filters.interest === '' || program.interest === filters.interest) &&
        (filters.nc === '' || program.nc === filters.nc) &&
        (filters.start === '' || program.start === filters.start) &&
        (filters.form === '' || program.form === filters.form) &&
        (filters.campus === '' || program.campus === filters.campus) &&
        (filters.search === '' || program.name.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
    setStudyPrograms(filteredPrograms);
    setLoading(false);
  }, [filters]); // Re-run effect when filters change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading study programs...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Error loading study programs: {error.message}</div>;
  }

  // Extract unique filter options from mock data
  const degrees = [...new Set(studyProgramsData.map(program => program.degree))];
  const interests = [...new Set(studyProgramsData.map(program => program.interest))];
  const ncs = [...new Set(studyProgramsData.map(program => program.nc))];
  const starts = [...new Set(studyProgramsData.map(program => program.start))];
  const forms = [...new Set(studyProgramsData.map(program => program.form))];
  const campuses = [...new Set(studyProgramsData.map(program => program.campus))];


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Unsere Studiengänge</h1>
      <p className="text-xl text-gray-700 mb-6">Finde deinen Studiengang</p>

      {/* Filter Section */}
      <div className="bg-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Abschluss</label>
          <select
            id="degree"
            name="degree"
            value={filters.degree}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            {degrees.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700">Interesse</label>
          <select
            id="interest"
            name="interest"
            value={filters.interest}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
             {interests.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="nc" className="block text-sm font-medium text-gray-700">NC</label>
          <select
            id="nc"
            name="nc"
            value={filters.nc}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
             {ncs.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700">Beginn</label>
          <select
            id="start"
            name="start"
            value={filters.start}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
             {starts.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="form" className="block text-sm font-medium text-gray-700">Studienform</label>
          <select
            id="form"
            name="form"
            value={filters.form}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
             {forms.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="campus" className="block text-sm font-medium text-gray-700">Campus</label>
          <select
            id="campus"
            name="campus"
            value={filters.campus}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
             {campuses.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="md:col-span-2 lg:col-span-1 flex items-end">
           <input
            type="text"
            name="search"
            id="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search programs..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
           <button className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </button>
        </div>
      </div>


      <StudyProgramList programs={studyPrograms} onNavigate={onNavigate} />
    </div>
  );
}

// ProgramDetailPage Component (Placeholder)
function ProgramDetailPage({ slug }) {
  const program = studyProgramsData.find(p => p.slug === slug);

  if (!program) {
    return <div className="container mx-auto px-4 py-8">Program not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{program.name}</h1>
      <p className="text-xl text-gray-700 mb-6">{program.degree}</p>
      <p>{program.shortDescription}</p>
      {/* Add more detailed program information here */}
    </div>
  );
}


// App Component (App.js)
function App() {
  const [currentPage, setCurrentPage] = useState('study-programs');
  const [currentProgramSlug, setCurrentProgramSlug] = useState(null);

  const handleNavigate = (page, slug = null) => {
    setCurrentPage(page);
    setCurrentProgramSlug(slug);
  };

  let PageComponent;
  switch (currentPage) {
    case 'home':
      PageComponent = () => <div className="container mx-auto px-4 py-8">Home Page Content</div>; // Placeholder
      break;
    case 'study-programs':
      PageComponent = () => <StudyProgramsPage onNavigate={handleNavigate} />;
      break;
    case 'international':
       PageComponent = () => <div className="container mx-auto px-4 py-8">International Page Content</div>; // Placeholder
       break;
    case 'research':
        PageComponent = () => <div className="container mx-auto px-4 py-8">Research Page Content</div>; // Placeholder
        break;
    case 'lifelong-learning':
         PageComponent = () => <div className="container mx-auto px-4 py-8">Lifelong Learning Page Content</div>; // Placeholder
         break;
    case 'program-detail':
        PageComponent = () => <ProgramDetailPage slug={currentProgramSlug} />;
        break;
    default:
      PageComponent = () => <div className="container mx-auto px-4 py-8">Page Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation onNavigate={handleNavigate} />
      <main>
        <PageComponent />
      </main>
      {/* Add a Footer component here */}
    </div>
  );
}

export default App;
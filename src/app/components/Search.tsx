import { useState, ChangeEvent } from 'react';
import Fuse from 'fuse.js';
import { Job } from '@/models/Job'; 

interface SearchProps {
  jobs: Job[];
}

export default function Search({ jobs }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  
  const fuse = new Fuse(jobs, {
    keys: [
      'title',        
      'description',  
      'remote',       
      'city',         
      'state',        
      'country'       
    ],
    threshold: 0.3,   
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setFilteredJobs(jobs);  
      return;
    }

    const result = fuse.search(query).map(({ item }) => item);
    setFilteredJobs(result);  
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="border border-gray-400 w-full py-2 px-3 rounded-md"
        placeholder="Search for a job..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="flex flex-col gap-4 mt-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-result">
              <h3>{job.title}</h3>
              <p>{job.city}, {job.state}, {job.country}</p>
              <p>{job.remote === 'yes' ? 'Remote' : 'On-site'}</p>
              <p>{job.description}</p>
            </div>
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
}

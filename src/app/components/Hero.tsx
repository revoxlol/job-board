
// import Search from './SearchComponent'
export default async function Hero() {
  return (
    <section className="container my-16 mb-16" style={{ marginTop: '15vh' }}> {/* Added marginTop of 25vh */}
      <h1 className="text-4xl font-bold text-center mr-20 py-1">
        Find your BIM job
      </h1>
      {/* <Search jobs={jobs} /> */}  
      <form className="flex gap-2 mt-4 max-w-md mx-auto">
        <input
          type="search"
          className="border border-gray-400 w-full py-2 px-3 rounded-md"
          placeholder="Search phrase.." />
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md">
          Search
        </button>
      </form>
    </section>
  );
}

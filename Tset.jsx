// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./App.css";
// import PokeCard from "./components/PokeCard";
// import { useDebounce } from "./Hooks/useDebounce";

// function App() {
//   const [pokemons, setPokemons] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(20);
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);
//   useEffect(() => {
//     fetchPokeData(true);
//   }, []);
//   useEffect(() => {
//     hendleSearchInput(debouncedSearchTerm);
//   }, [debouncedSearchTerm]);
//   const fetchPokeData = async (isFirstFetch) => {
//     try {
//       const offsetValue = isFirstFetch ? 0 : offset + limit;
//       const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
//       const response = await axios.get(url);
//       isFirstFetch
//         ? setPokemons([...response.data.results])
//         : setPokemons([...pokemons, ...response.data.results]);
//       setOffset(offsetValue);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const hendleSearchInput = async (searchTerm) => {
//     if (searchTerm.length > 0) {
//       try {
//         const response = await axios.get(
//           `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
//         );
//         const pokemonData = {
//           name: searchTerm,
//           url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
//         };
//         setPokemons([pokemonData]);
//       } catch (error) {
//         setPokemons([]);
//         console.error(error);
//       }
//     } else {
//       fetchPokeData(true);
//     }
//   };
//   return (
//     <article className="pt-6">
//       <header className="flex flex-col px-4 z-50">
//         <div className="relative z-50">
//           <form className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//               }}
//               className="text-xs w-[20.5rem] h-6 px-2 py-1 rounded-lg bg-[hsl(214,13%,47%)] text-gray-300 text-center"
//             />
//             <button
//               type="submit"
//               className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-lg text-center absolute right-0 hover:bg-slate-700"
//             >
//               검색
//             </button>
//           </form>
//           <div>{debouncedSearchTerm}</div>
//         </div>
//       </header>
//       <section className="pt-6 flex flex-col justify-center items-center">
//         <div className="flex flex-row flex-wrap gap-[16px] items-center  justify-center px-2 max-w-4xl">
//           {pokemons.length > 0 ? (
//             pokemons.map(({ name, url }, index) => (
//               <PokeCard key={`${index}-${name}`} url={url} name={name} />
//             ))
//           ) : (
//             <h2 className="font-medium text-lg text-slate-900 mb-1">
//               포켓몬이 없습니다.
//             </h2>
//           )}
//         </div>
//       </section>
//       <div className={"text-center"}>
//         <button
//           className={
//             "bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
//           }
//           onClick={() => fetchPokeData(false)}
//         >
//           더 보기
//         </button>
//       </div>
//     </article>
//   );
// }

// export default App;

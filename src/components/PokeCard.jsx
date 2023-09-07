import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";
import styleColors from "../../tailwind.config.cjs"
import LazyImage from '@/components/LazyImage.jsx';
function PokeCard({ url, name }) {
  const [pokemon, setPokemon] = useState([]);
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const colors = styleColors.theme.extend.colors;
  useEffect(() => {
    fetchPokeDetailData();
  }, []);
  const fetchPokeDetailData = async () => {
    try {
      const response = await axios.get(url);
      const pokeData = formatPokemonData(response.data);
      setPokemon(pokeData);
    } catch (error) {
      console.error(error);
    }
  };
  const formatPokemonData = (params) => {
    const { id, types, name } = params;
    const pokemonData ={
      id,
      name,
      type:types[0].type.name
    }
    return pokemonData;
  }
  return (
    <>
      {pokemon.id && (
        <Link
          to={`/pokemon/${name}`}
          className={`box-border rounded-lg w-[8.5rem] h-[8.5rem] z-8 bg-slate-800 justify-between items-center hover:scale-105 transition-all`}
          style={{ color: colors[pokemon.type] }}
        >
          <div
            className={`h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id?.toString().padStart(3, "00")}
          </div>
          <div className={`w-full f-6 flex items-conter justify-center`}>
            <div
              className={`box-border relative flex w-full h-[5.5rem] basis-full justify-center items-center`}
            >
              <LazyImage src={img} alt={pokemon.name} />
            </div>
          </div>
          <div
            className={`text-center text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1`}
            style={{ backgroundColor: colors[pokemon.type] }}
          >
            {pokemon.name}
          </div>
        </Link>
      )}
    </>
  );
}

export default PokeCard
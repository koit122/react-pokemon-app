import axios from "axios";
import uuid from "react-uuid"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { Loading } from "@/assets/Loading";
import { LessThan } from "@/assets/LessThan";
import { GreaterThan } from "@/assets/GreaterThan";
import { ArrowLeft } from "@/assets/ArrowLeft";
import { Balance } from "@/assets/Balance";
import { Vector } from "@/assets/Vector";
import styleColors from "../../../tailwind.config.cjs"
import Type from "../../components/Type";
import BaseStat from "../../components/BaseStat";
import DamageModal from "../../components/DamageModal";

export default function DetailPage() {
  const [pokemon, setPokemon] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const params = useParams();
  const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const color = styleColors.theme.extend.colors;
  useEffect(() => {
    setIsLoading(true);
    fetchPokemonData();
  }, [params.id]);
  const fetchPokemonData = async () => {
    try {
      const url = `${baseUrl}${params.id}`;
      const { data: pokemonData } = await axios.get(url);
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities, sprites } = pokemonData;
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations
          })
        )
        const formatedpokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map(type => type.type.name),
          sprites: formatPokemonSprites(sprites),
          description: await getPokemonDescription(id)
        }
        setPokemon(formatedpokemonData);
        setIsLoading(false);   
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  const filterAndFormatDescription = (flaveorText) => {
    const koreanDescriptions = flaveorText
      ?.filter((text) => text.language.name === 'ko')
      .map((text) => text.flavor_text.replace(/\r|\n|\f/g, ' '))
    return koreanDescriptions
  }
  const getPokemonDescription = async (id) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
      const { data: pokemonSpecies } = await axios.get(url);
      const descriptions = filterAndFormatDescription(pokemonSpecies.flavor_text_entries);
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    } catch(error) {
      console.error(error)
    }
    
  }
  const formatPokemonSprites = (sprites) => {
    const newSprites = { ...sprites }
    Object.keys(newSprites).forEach(key => {
      if (typeof newSprites[key] !== 'string') {
        delete newSprites[key];
      }
    })
    return Object.values(newSprites);
  }
  const formatPokemonStats = ([
    statHp,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]) => [
        {name: 'Hit Points', baseStat: statHp.base_stat},
        {name: 'Attatck', baseStat: statATK.base_stat},
        {name: 'Defense', baseStat: statDEP.base_stat},
        {name: 'Special Attack', baseStat: statSATK.base_stat},
        {name: 'Special Defense', baseStat: statSDEP.base_stat},
        {name: 'Speed', baseStat: statSPD.base_stat},
  ]
  const formatPokemonAbilities = (abilities) => {
    return abilities.filter((_, index) => index <= 1).map((obj) => {
      return obj.ability.name.replaceAll('-', ' ');
    })
  }
  const getNextAndPreviousPokemon = async (id) => {
    try {
     const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`
      const { data:pokemonData } = await axios.get(urlPokemon);
      const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
      const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));
      return {
        next: nextResponse?.data?.results?.[0]?.name,
        previous : previousResponse?.data?.results?.[0]?.name
      } 
    } catch (error) {
      console.log(error);
    }
  }
  if (isLoading) {
    return (
      <div
        className={'absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50'}
      >
        loading
        <Loading className={'w-12 h-12 z-50 animate-spin text-slate-900'} />
      </div>
    );
  }
  if (!isLoading && !pokemon) {
    return (
      <div>
        ...Not Found
      </div>
    )
  }
  return (
    <article className={"flex items-center gap-1 flex-col w-full"}>
      <div
        className={`w-full h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
        style={{ backgroundColor: color[pokemon.types[0]] }}
      >
        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}
        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}
        <section
          className={
            "typeColorBox w-full flex flex-col z-20 items-center justify-end relative h-full mt-[5rem]"
          }
        >
          <div
            className={
              "absolute z-30 top-6 flex items-center w-full justify-between px-2"
            }
          >
            <div className={"flex items-center gap-1"}>
              <Link to={"/"}>
                <ArrowLeft className={"w-6 h-8 text-zinc-200"} />
              </Link>
              <h1 className={"text-zinc-200 font-bold text-xl capitalize"}>
                {pokemon.name}
              </h1>
            </div>
            <div className={"text-zinc-200 font-bold text-m capitalize"}>
              #{pokemon.id.toString().padStart(3, "00")}
            </div>
          </div>
          <div className={"relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16"}>
            <img
              src={img}
              alt={pokemon.name}
              width="100%"
              height="auto"
              loading="lazy"
              className={"object-contain h-full"}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>
        <section className="w-full min-h-[65vh] bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {pokemon.types.map((type) => {
              return <Type key={type} type={type} />;
            })}
          </div>
          <h2
            className={"text-base font-semibold"}
            style={{ color: color[pokemon.types[0]] }}
          >
            정보
          </h2>
          <div className="w-full flex items-center justify-between gap-3 text-center max-w-[400px]">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">height</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">abilities</h4>
              {pokemon.abilities.map((ability) => {
                return (
                  <div
                    key={ability}
                    className="text-[0.5rem] first-line:text-zinc-200 capitalize"
                  >
                    {ability}
                  </div>
                );
              })}
            </div>
          </div>
          <h2
            className={"text-base font-semibold"}
            style={{ color: color[pokemon.types[0]] }}
          >
            기본 능력치
          </h2>
          <div className="w-full flex justify-center">
            <table>
              <tbody>
                {pokemon.stats.map((stat) => (
                  <BaseStat
                    key={stat.name}
                    valueStat={stat.baseStat}
                    nameStat={stat.name}
                    type={pokemon.types[0]}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <h2
              className={"text-base font-semibold"}
              style={{ color: color[pokemon.types[0]] }}
            >
              설명
            </h2>
            <p className="text-md leading-4 font-sans text-zinc-200 max-w-[30rem]">
              {pokemon.description}
            </p>
          </div>
          <div className="flex my-8 flex-wrap justify-center max-w-[25rem]">
            {pokemon.sprites &&
              pokemon.sprites.map((imgURL) => {
                return <img key={uuid()} src={imgURL} alt="sprites" />;
              })}
          </div>
        </section>
      </div>
      {isModalOpen && (
        <DamageModal
          damages={pokemon.DamageRelations}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </article>
  );
}
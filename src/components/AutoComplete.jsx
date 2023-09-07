import { useState } from 'react'
function AutoComplete({ allPokemons, setDisplayedPokemons }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filterNames = (input) => {
    const value = input?.toLowerCase();
    return value ? allPokemons.filter(e => e.name.includes(value)) : [];
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = isNaN(Number(searchTerm)) ? searchTerm.trim() : allPokemons[Number(searchTerm) - 1].name;
    //const pokemonDataResult = filterNames(text).filter(e => e.name === searchTerm);
    const pokemonDataResult = filterNames(text);
    setDisplayedPokemons(pokemonDataResult);
    setSearchTerm("");
  }
  const checkEqualName = (input) => {
    const filteredArray = isNaN(Number(input))
      ? filterNames(input)
      : filterNames(allPokemons[Number(input) - 1]?.name);
    return filteredArray[0]?.name === input ? [] : filteredArray;
  }
  return (
    <div className="relative z-[60]">
      <form
        className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="text-xs w-[20.5rem] h-6 px-2 py-1 rounded-lg bg-[hsl(214,13%,47%)] text-gray-300 text-center"
        />
        <button
          type="submit"
          className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-lg text-center absolute right-0 hover:bg-slate-700"
        >
          검색
        </button>
      </form>
      {checkEqualName(searchTerm).length > 0 && (
        <div
          className={
            "w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2"
          }
        >
          <div
            className={
              "flex justify-center w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2"
            }
          >
            <ul
              className={
                "w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-2 overflow-auto scrollbar-none"
              }
            >
              {checkEqualName(searchTerm).map((e, i) => (
                <li key={`button-${i}`}>
                  <button
                    onClick={()=>setSearchTerm(e.name)}
                    className={
                      "text-base w-full hover:bg-gray-600 p-[2px] text-gray-100"
                    }
                  >
                    {e.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoComplete
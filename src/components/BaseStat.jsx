import { useEffect, useRef } from "react";
import styleColors from "../../tailwind.config.cjs"
export default function BaseStat({ valueStat, nameStat, type }) {
  const bg = styleColors.theme.extend.colors[type];
  const ref = useRef(null);
  useEffect(() => {
    const setValueStat = ref.current;
    const calc = valueStat * (100 / 255)
    setValueStat.style.width = calc + "%";
    
  })
  return (
    <tr className='w-full text-white'>
      <td className='sm:px-5'>{nameStat}</td>
      <td className='px-2 sm:px-3'>{valueStat}</td>
      <td>
        <div
          className='flex items-center h-2 overflow-hidden w-full min-w-[10rem] bg-gray-600 rounded'
        >
          <div
            ref={ref}
            className='h-3 w-0 transition-all duration-500'
            style={{ backgroundColor: bg}}
          ></div>
        </div>
      </td>
      <td className='px-2 sm:px-5'>225</td>
    </tr>
  );
}
import styleColors from "../../tailwind.config.cjs"
export default function Type({ type, damageValue }) {
  const bg = styleColors.theme.extend.colors[type]
  return (
    <div>
      <span
        className="flex gap-[0.1rem] h-[1.5rem] py-1 px-3 rounded-lg font-bold text-zinc-800 text-[0.6rem] leading-[0.8rem] flex gep-1 justify-center items-center capitalize "
        style={{ backgroundColor: bg }}
      >
        {type}
        {damageValue && (
          <span className="bg-zinc-200/40 p-[.125rem] rounded">
            {damageValue}
          </span>
        )}
      </span>
    </div>
  );
}

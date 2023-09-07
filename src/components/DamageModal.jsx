import { useRef } from "react";
import { createPortal } from "react-dom";
import DamageRelations from "./DamageRelations";
import useOnclickOutside from "../Hooks/useOnclickOutside";

export default function DamageModal({ damages, setIsModalOpen }) {
  const ref = useRef();
  useOnclickOutside(ref, ()=>{setIsModalOpen(false)});
  return createPortal(
    <div className="flex items-center justify-center z-40 fixed left-0 bottom-0 w-full h-full bg-gray-800">
      <div
        className="modal bg-white rounded-lg w-1/2"
        ref={ref}
      >
        <div className="flex flex-col items-center p-4">
          <div className="flex items-center w-full justify-between">
            <div className="text-gray-900 font-medium text-lg">데미지 관계</div>
            <span
              className="modalclose text-gray-900 font-medium text-lg cursor-pointer"
              onClick={()=>setIsModalOpen(false)}
            >
              X
            </span>
          </div>
          <DamageRelations damages={damages} />
        </div>
      </div>
    </div>,
    document.querySelector('#portal')
  );
}
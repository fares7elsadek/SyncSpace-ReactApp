import Image from 'next/image'
import React from 'react'

const Message = ({ name, img, message, user = false }: { name: string; img: any; message: string; user?: boolean }) => {
  return (
    <div
      className={`border text-white w-[70%] rounded-xl p-2 ${
        user ? "ml-auto" : "mr-auto"
      }`}
      style={{ wordWrap: "break-word" }}
    >
      {/* user image with name */}
      <div className="flex items-center gap-2">
        <Image alt="user image" src={img} className="w-10 h-10 rounded-full border" />
        <span className="font-semibold">{name}</span>
      </div>
      {/* message */}
      <div className="mt-2 text-sm">
        {message}
      </div>
    </div>
  );
};

export default Message;

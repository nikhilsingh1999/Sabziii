"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function UploadButton() {
  return (
    <CldUploadWidget
      uploadPreset="products"
      onSuccess={(result) => {
        console.log(result);
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>
          Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
}

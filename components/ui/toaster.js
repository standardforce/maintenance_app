'use client';

import * as Toast from '@radix-ui/react-toast';
import { useState } from 'react';
import { X } from 'lucide-react';

const Toaster = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="bg-white border border-gray-200 shadow-lg rounded-md p-4 text-gray-900"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <Toast.Action asChild altText="Close">
            <button
              onClick={() => setOpen(false)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </Toast.Action>
        </div>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 w-[320px] space-y-2" />
    </Toast.Provider>
  );
};

export default Toaster;

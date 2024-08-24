import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classNames from 'classnames';

const initialImages = [
  { id: 1, src: '/images/ver.png', value: 1 },
  { id: 2, src: '/images/per.png', value: 11 },
  { id: 3, src: '/images/nor.png', value: 4 },
  { id: 4, src: '/images/pia.png', value: 81 },
  { id: 5, src: '/images/ham.png', value: 44 },
  { id: 6, src: '/images/rus.png', value: 63 },
  { id: 7, src: '/images/lec.png', value: 16 },
  { id: 8, src: '/images/sai.png', value: 55 },
  { id: 9, src: '/images/alo.png', value: 14 },
  { id: 10, src: '/images/str.png', value: 18 },
  { id: 11, src: '/images/ric.png', value: 3 },
  { id: 12, src: '/images/tsu.png', value: 22 },
  { id: 13, src: '/images/gas.png', value: 10 },
  { id: 14, src: '/images/oco.png', value: 31 },
  { id: 15, src: '/images/hul.png', value: 27 },
  { id: 16, src: '/images/mag.png', value: 20 },
  { id: 17, src: '/images/alb.png', value: 23 },
  { id: 18, src: '/images/sar.png', value: 2 },
  { id: 19, src: '/images/bot.png', value: 77 },
  { id: 20, src: '/images/zho.png', value: 24 }
];

const Slot = ({ id, onDrop, image }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE',
    drop: (item) => onDrop(id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={classNames('slot', { 'slot-over': isOver })}
      style={{
        width: '100px',
        height: '100px',
        border: '1px solid black',
        display: 'inline-block',
        margin: '5px',
      }}
    >
      {image && (
        <img
          src={image.src}
          alt={`Driver number ${image.value}`}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

const DraggableImage = ({ image }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: image,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <img
      ref={drag}
      src={image.src}
      alt={`Driver number ${image.value}`}
      style={{
        width: '100px',
        height: '100px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    />
  );
};

const PredictionForm = () => {
  const [slots, setSlots] = useState(Array(10).fill(null));
  const [images, setImages] = useState(initialImages);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleDrop = (slotId, item) => {
    const newSlots = [...slots];
    newSlots[slotId] = item;
    setSlots(newSlots);

    // Remove the image from the available images list
    setImages(images.filter(image => image.id !== item.id));
  };

  const handleSubmit = async () => {
    const payload = {
      predictions: slots.map((slot) => slot?.value || null),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/v1/userpredictions/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Predictions updated');
      } else {
        alert('Failed to update predictions');
      }
    } catch (error) {
      alert('Error occurred while updating predictions');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4">
        {images.map((image) => (
          <DraggableImage key={image.id} image={image} />
        ))}
      </div>

      <div className="slots flex space-x-4 mt-4">
        {slots.map((slot, index) => (
          <Slot key={index} id={index} image={slot} onDrop={handleDrop} />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
      >
        Submit
      </button>
    </DndProvider>
  );
};

export default PredictionForm;

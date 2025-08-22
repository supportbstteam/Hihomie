'use client'
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { cardUpdate, get_customer } from '@/store/customer'
import Nuevos from "./Nuevos";
import Rechazado from "./Rechazado";
import EnElBanco from "./EnElBanco";
import Aprobado from "./Aprobado";
import Contactado from "./Contactado";

const DragParent = () => {
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);

  const [columns, setColumns] = useState({
    nuevos: [],
    contactado: [],
    enelbanco: [],
    aprobado: [],
    rechazado: [],
  });

  // fetch customers from API
  useEffect(() => {
    dispatch(get_customer());
  }, [dispatch]);

  useEffect(() => {
    // if you want, you can set customers with flag=1 in "nuevos"
    if (customer && Array.isArray(customer)) {
      const filtered = customer.filter((c) => c.flag === 1);
      const filtered1 = customer.filter((c) => c.flag === 2);
      const filtered2 = customer.filter((c) => c.flag === 3);
      const filtered3 = customer.filter((c) => c.flag === 4);
      const filtered4 = customer.filter((c) => c.flag === 5);
      setColumns((prev) => ({
        ...prev,
        nuevos: filtered,
        contactado: filtered1,
        enelbanco: filtered2,
        aprobado: filtered3,
        rechazado: filtered4,
      }));
    }
  }, [customer]);

  const onDropCard = (userId, from, to) => {

    if (from === to) return;
    const sourceCol = [...columns[from]];


    const destCol = [...columns[to]];
    const userIndex = sourceCol.findIndex((u) => u._id === userId);

    if (userIndex === -1) return;

    const [moved] = sourceCol.splice(userIndex, 1);
    destCol.push(moved);

    setColumns({
      ...columns,
      [from]: sourceCol,
      [to]: destCol,
    });

     dispatch(cardUpdate({userId,to}));

  };

  return (
    <div className="flex gap-4">
      <Nuevos
        users={columns.nuevos}
        setUsers={setColumns}
        columnKey="nuevos"
        onDropCard={onDropCard}
      />

      <Contactado 
         users={columns.contactado}
        setUsers={setColumns}
        columnKey="contactado"
        onDropCard={onDropCard}
      
      />
      
      <EnElBanco 
      users={columns.enelbanco}
        setUsers={setColumns}
        columnKey="enelbanco"
        onDropCard={onDropCard}
      />
      <Aprobado 
        
        users={columns.aprobado}
        setUsers={setColumns}
        columnKey="aprobado"
        onDropCard={onDropCard}
      
      />
      <Rechazado
        users={columns.rechazado}
        setUsers={setColumns}
        columnKey="rechazado"
        onDropCard={onDropCard}
      />
    </div>
  );
};

export default DragParent;

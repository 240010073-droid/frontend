import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { format, addDays, startOfWeek, subDays, isSameDay, isBefore, startOfDay, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';

export default function LandingPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  
  const carouselRef = useRef(null);

  const availableHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  useEffect(() => {
    api.get('/portfolios').then(res => setPortfolios(res.data)).catch(console.error);
    api.get('/blocked-days').then(res => setBlockedDays(res.data.map(d => d.date))).catch(console.error);
  }, []);

  useEffect(() => {
    if(selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      api.get(`/appointments/booked?date=${dateStr}`).then(res => {
         const blocked = res.data.map(a => a.start_time.substring(0,5));
         setBookedSlots(blocked);
         setSelectedTime(null);
      }).catch(console.error);
    }
  }, [selectedDate]);

  useEffect(() => {
    let interval;
    if (carouselRef.current && portfolios.length > 0) {
      interval = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 5) {
            carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
          }
        }
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [portfolios]);

  const today = startOfDay(new Date());
  const [currentWeek, setCurrentWeek] = useState(today);

  const getDaysArray = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({length: 14}).map((_, i) => addDays(start, i));
  };

  const isDayAvailable = (date) => {
    const dayOfWeek = getDay(date);
    if(dayOfWeek === 0) return false; 
    if(isBefore(date, today)) return false; 
    const dateStr = format(date, 'yyyy-MM-dd');
    if(blockedDays.includes(dateStr)) return false; 
    return true;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if(!selectedDate || !selectedTime) return alert("Selecciona fecha y hora");

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    try {
      await api.post('/appointments', { name, phone, appointment_date: dateStr, start_time: selectedTime, end_time: selectedTime, notes: '' });
      const message = `¡Hola YansyNails! ✨ Vengo a agendar una cita.\nMi nombre es: *${name}*\nFecha: *${dateStr}*\nHora: *${selectedTime}*`;
      const url = `https://api.whatsapp.com/send?phone=526971140318&text=${encodeURIComponent(message)}`;
      
      // Direct redirect for better mobile compatibility
      window.location.href = url;
      
      setName(''); setPhone(''); setSelectedDate(null); setSelectedTime(null);
    } catch(err) { 
      alert("Error al agendar. Por favor intenta de nuevo."); 
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#FCFBF8] text-[#2C2C2C] overflow-x-hidden relative selection:bg-[#ECA0A6] selection:text-white">
      
      {/* Navbar Nude/Blush */}
      <nav className="fixed w-full z-50 bg-[#FCFBF8]/80 backdrop-blur-md border-b border-[#ECA0A6]/30 py-3 px-6 md:px-12 flex justify-between items-center shadow-sm transition-all duration-300">
        <motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="w-14 h-14 rounded-full border border-[#DDB771] overflow-hidden shadow-sm flex items-center justify-center bg-white p-0.5">
             <img src="/logo.png" alt="YansyNails Logo" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=YN&background=ECA0A6&color=fff"; }} />
          </div>
          <h1 className="text-3xl font-serif tracking-wide text-[#2C2C2C]">
            Yansy<span className="text-[#D8A7B1]">Nails</span>
          </h1>
        </motion.div>
        
        <motion.a 
          href="#agendar" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#D8A7B1] text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium shadow-md hover:bg-[#C8949E] transition-colors border border-transparent"
        >
          Reserva
        </motion.a>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center min-h-[90vh] relative z-10 overflow-hidden">
        
        {/* Soft Watercolor Blobs (Static for performance) */}
        <div className="absolute top-[0%] left-[-10%] w-[60vw] h-[60vw] bg-[#F8E9E7] rounded-full blur-[100px] opacity-70 -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F3E1DF] rounded-full blur-[120px] opacity-60 -z-10" />

        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/4 left-[15%] text-[#DDB771] opacity-50"><Sparkles size={40} strokeWidth={1.5} /></motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="z-10 max-w-4xl bg-white/30 backdrop-blur-sm p-10 rounded-[2rem] border border-white/60 shadow-[0_10px_40px_rgba(216,167,177,0.1)]">
          <span className="inline-block text-[#C5A572] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 border-b border-[#C5A572]/30 pb-2">
            Elegancia & Sofisticación
          </span>
          
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.15] text-[#2C2C2C]">
            El arte de cuidar <br/> <i className="text-[#D8A7B1] font-light">tus manos</i>
          </h2>
          
          <p className="text-lg md:text-xl text-[#6B6B6B] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Sumérgete en una experiencia de belleza relajante. Diseños exclusivos, acabados perfectos y tonos que combinan con tu esencia.
          </p>
          
          <motion.a 
            href="#agendar" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-3 bg-[#2C2C2C] text-white px-10 py-5 rounded-full text-lg font-medium shadow-[0_8px_20px_rgba(44,44,44,0.3)] hover:bg-[#3D3D3D] transition group"
          >
            <CalendarIcon size={20} className="text-[#D8A7B1] group-hover:rotate-12 transition-transform" /> 
            Agendar Mi Cita
          </motion.a>
        </motion.div>
      </section>

      {/* Galería */}
      <section className="py-24 relative bg-white border-y border-[#F3E1DF]" id="galeria">
        <div className="max-w-screen-2xl mx-auto px-4 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16 px-4">
            <h3 className="text-4xl md:text-5xl font-serif font-light mb-4 text-[#2C2C2C]">Nuestro Portafolio</h3>
            <div className="w-16 h-px bg-[#C5A572] mx-auto mb-6"></div>
            <p className="text-[#6B6B6B] max-w-md mx-auto font-light">Inspiración delicada en cada detalle de nuestras clientas.</p>
          </motion.div>
          
          <div ref={carouselRef} className="flex overflow-x-auto pb-12 gap-8 px-8 snap-x snap-mandatory scrollbar-hide" style={{scrollbarWidth:'none'}}>
            {portfolios.length === 0 ? (
               <p className="text-center text-[#D8A7B1] w-full my-10 font-light">Cargando portafolio...</p>
            ) : portfolios.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex-none w-80 md:w-[400px] h-[500px] bg-white rounded-2xl overflow-hidden snap-center relative group shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-[#F8E9E7]"
              >
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <h4 className="text-[#F8E9E7] font-serif text-2xl mb-2">{item.title}</h4>
                  {item.description && <p className="text-white/80 text-sm font-light leading-relaxed">{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel Agendamiento */}
      <section className="py-24 relative bg-[#FCFBF8]" id="agendar">
        <div className="max-w-6xl mx-auto px-4 z-10 relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(216,167,177,0.15)] border border-[#F8E9E7] overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Formulario Section */}
            <div className="lg:w-[45%] p-8 lg:p-14 bg-[#F9EDE9] text-[#2C2C2C] relative border-r border-[#F3E1DF]">
               <h3 className="text-4xl font-serif mb-4 text-[#2C2C2C]">Reserva un espacio</h3>
               <p className="text-[#6B6B6B] mb-10 font-light leading-relaxed">Llena tus datos para asegurar tu cita. Te redireccionaremos a WhatsApp para el paso final.</p>
               
               <form onSubmit={handleBooking} className="space-y-6 relative z-10">
                 <div>
                    <label className="block text-xs font-semibold text-[#2C2C2C] mb-2 uppercase tracking-widest">Nombre Completo</label>
                    <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white border border-[#ECA0A6]/40 rounded-xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D8A7B1] focus:ring-1 focus:ring-[#D8A7B1] transition font-light placeholder-gray-400" placeholder="Escribe tu nombre hermoso" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-[#2C2C2C] mb-2 uppercase tracking-widest">Número (WhatsApp)</label>
                    <input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-white border border-[#ECA0A6]/40 rounded-xl p-4 text-[#2C2C2C] focus:outline-none focus:border-[#D8A7B1] focus:ring-1 focus:ring-[#D8A7B1] transition font-light placeholder-gray-400" placeholder="+52 000 000 0000" />
                 </div>
                 
                 <AnimatePresence>
                   {selectedDate && selectedTime && (
                     <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm border border-[#ECA0A6]/30">
                       <CheckCircle className="text-[#D8A7B1] shrink-0" size={24} />
                       <div>
                         <p className="font-semibold text-[#2C2C2C] uppercase text-xs tracking-widest mb-1">Cita Seleccionada</p>
                         <p className="text-sm font-light text-[#6B6B6B] capitalize">{format(selectedDate, "eeee dd 'de' MMMM", {locale: es})} a las <span className="font-medium text-[#2C2C2C]">{selectedTime}</span></p>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   type="submit" disabled={!selectedDate || !selectedTime} 
                   className="w-full bg-[#D8A7B1] text-white font-medium text-lg py-4 rounded-xl disabled:opacity-50 disabled:bg-gray-300 transition shadow-md mt-4 hover:bg-[#C8949E]"
                 >
                    Confirmar por WhatsApp
                 </motion.button>
               </form>
            </div>

            {/* Calendario Section */}
            <div className="lg:w-[55%] p-8 lg:p-14 bg-white">
               <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                 <h4 className="text-2xl font-serif text-[#2C2C2C]">Elige el Día</h4>
                 <div className="flex gap-2">
                   <button onClick={()=>setCurrentWeek(subDays(currentWeek, 7))} className="p-2 rounded-full border border-gray-200 text-[#6B6B6B] hover:bg-[#F9EDE9] hover:border-[#D8A7B1] transition"><ChevronLeft size={20}/></button>
                   <button onClick={()=>setCurrentWeek(addDays(currentWeek, 7))} className="p-2 rounded-full border border-gray-200 text-[#6B6B6B] hover:bg-[#F9EDE9] hover:border-[#D8A7B1] transition"><ChevronRight size={20}/></button>
                 </div>
               </div>

               <div className="grid grid-cols-7 gap-2 mb-10">
                 {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d,i)=><div key={i} className="text-center text-[10px] font-bold tracking-widest uppercase text-[#D8A7B1]">{d}</div>)}
                 
                 {getDaysArray().map((date, i) => {
                   const available = isDayAvailable(date);
                   const isSelected = selectedDate && isSameDay(date, selectedDate);
                   
                   return (
                     <button 
                       key={i}
                       type="button"
                       disabled={!available}
                       onClick={() => {setSelectedDate(date); setSelectedTime(null);}}
                       className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all border
                          ${!available ? 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed' : 'bg-white border-gray-100 text-[#2C2C2C] cursor-pointer hover:border-[#D8A7B1] hover:shadow-sm'}
                          ${isSelected ? '!bg-[#D8A7B1] !text-white !border-[#D8A7B1] shadow-md transform scale-105' : ''}
                       `}
                     >
                       <span className="text-[10px] uppercase font-light mb-0.5 opacity-80">{format(date, 'MMM', {locale:es}).substring(0,3)}</span>
                       <span className="text-lg font-medium">{format(date, 'd')}</span>
                     </button>
                   );
                 })}
               </div>

               <AnimatePresence>
                 {selectedDate && (
                   <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}>
                     <h4 className="text-2xl font-serif text-[#2C2C2C] mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                       Elige la Hora <Clock size={20} className="text-[#C5A572] font-light" />
                     </h4>
                     <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-3">
                       {availableHours.map(time => {
                          const isBooked = bookedSlots.includes(time);
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-3 rounded-xl text-sm transition-all text-center border font-medium
                                ${isBooked ? 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed line-through decoration-gray-300 font-light' : 'bg-white border-gray-200 hover:border-[#D8A7B1] text-[#2C2C2C] hover:bg-[#F9EDE9]/50'}
                                ${isSelected ? '!bg-[#2C2C2C] !text-white !border-[#2C2C2C] shadow-md transform scale-105' : ''}
                              `}
                            >
                              {time}
                            </button>
                          );
                       })}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Nude Elegante */}
      <footer className="bg-[#2C2C2C] text-white py-16 text-center">
        <h2 className="text-4xl font-serif mb-4 font-light tracking-wide">Yansy<span className="text-[#D8A7B1] italic">Nails</span></h2>
        <p className="text-gray-300 mb-8 max-w-sm mx-auto font-light leading-relaxed">
          Transformando manos, creando arte.<br/>Atención exclusiva de Lunes a Sábado.
        </p>
        <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">© 2026 Yansy Nails. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

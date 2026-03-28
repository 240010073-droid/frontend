import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Image as ImageIcon, LogOut, Check, X, Trash2, Upload } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('citas');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col md:flex-row font-sans text-[#2C2C2C]">
      {/* Sidebar Nude Elegante */}
      <aside className="w-full md:w-64 bg-[#2C2C2C] text-white p-6 shadow-xl flex flex-col">
        <h2 className="text-3xl font-serif text-center mb-10 tracking-widest font-light">
          Yansy<span className="text-[#D8A7B1] italic">Nails</span>
        </h2>
        
        <nav className="flex-1 space-y-3 font-light text-sm">
          <button onClick={()=>setActiveTab('citas')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab==='citas' ? 'bg-[#D8A7B1] text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Calendar size={18} /> Resumen Citas
          </button>
          <button onClick={()=>setActiveTab('dias')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab==='dias' ? 'bg-[#D8A7B1] text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Calendar size={18} className="opacity-70" /> Bloquear Días
          </button>
          <button onClick={()=>setActiveTab('portfolio')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab==='portfolio' ? 'bg-[#D8A7B1] text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <ImageIcon size={18} /> Trabajos / Galería
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto w-full flex items-center gap-3 p-3 text-red-300 hover:bg-white/10 rounded-xl transition text-sm font-light">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {activeTab === 'citas' && <AppointmentsTab />}
        {activeTab === 'dias' && <BlockedDaysTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
      </main>
    </div>
  );
}

function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  
  const load = () => api.get('/appointments').then(res => setAppointments(res.data)).catch(console.error);
  useEffect(() => { load() }, []);

  const updateStatus = (id, status) => {
    api.put(`/appointments/${id}`, { status }).then(load).catch(err => alert("Error: "+err.message));
  };

  const deleteApp = (id) => {
    if(confirm("¿Seguro que deseas eliminar esta cita?")) {
      api.delete(`/appointments/${id}`).then(load).catch(console.error);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F8E9E7] p-8">
      <h3 className="text-3xl font-serif mb-8 text-[#2C2C2C] border-b border-[#F8E9E7] pb-6 font-light">Citas Agendadas</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs tracking-widest font-semibold">
              <th className="p-4 rounded-tl-lg">Fecha</th>
              <th className="p-4">Clienta</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Estado</th>
              <th className="p-4 rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-[#FCFBF8]">
                <td className="p-4 font-medium text-[#2C2C2C]">
                  {format(parseISO(app.appointment_date), "dd/MMM/yyyy")} <br/> <span className="text-[#D8A7B1] text-sm">{app.start_time.substring(0,5)}</span>
                </td>
                <td className="p-4 text-[#6B6B6B]">{app.name}</td>
                <td className="p-4"><a href={`https://wa.me/${app.phone.replace('+','')}`} target="_blank" className="text-green-600 hover:text-green-800 transition">{app.phone}</a></td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold ${app.status==='confirmed' ? 'bg-[#F9EDE9] text-[#D8A7B1]' : app.status==='cancelled' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {app.status === 'pending' && <button onClick={()=>updateStatus(app.id, 'confirmed')} className="p-2 border border-[#D8A7B1]/30 text-[#D8A7B1] rounded-lg hover:bg-[#F9EDE9] transition" title="Confirmar"><Check size={16}/></button>}
                  {app.status === 'pending' && <button onClick={()=>updateStatus(app.id, 'cancelled')} className="p-2 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 transition" title="Cancelar"><X size={16}/></button>}
                  <button onClick={()=>deleteApp(app.id)} className="p-2 border border-red-200 text-red-400 rounded-lg hover:bg-red-50 transition" title="Eliminar"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-light">No hay citas en tu agenda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlockedDaysTab() {
  const [days, setDays] = useState([]);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const load = () => api.get('/blocked-days').then(res => setDays(res.data)).catch(console.error);
  useEffect(() => { load() }, []);

  const store = async (e) => {
    e.preventDefault();
    try {
      await api.post('/blocked-days', { date, reason });
      setDate(''); setReason('');
      load();
    } catch(err) { alert("Error al bloquear: " + err.response?.data?.message); }
  };

  const remove = (id) => { api.delete(`/blocked-days/${id}`).then(load).catch(console.error); };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl shadow-sm border border-[#F8E9E7] p-8 h-fit">
        <h3 className="text-2xl font-serif mb-6 border-b border-[#F8E9E7] pb-4 font-light text-[#2C2C2C]">Inhabilitar Fecha</h3>
        <form onSubmit={store} className="space-y-5">
          <div><label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2 font-semibold">Día en que no trabajarás</label><input type="date" required value={date} onChange={e=>setDate(e.target.value)} className="w-full p-3 border border-gray-200 focus:border-[#D8A7B1] rounded-xl outline-none transition text-[#2C2C2C]" /></div>
          <div><label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2 font-semibold">Motivo Corto</label><input type="text" value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-3 border border-gray-200 focus:border-[#D8A7B1] rounded-xl outline-none transition text-[#2C2C2C]" placeholder="Ej: Vacaciones o Evento Especial" /></div>
          <button className="bg-[#2C2C2C] text-white px-6 py-3 rounded-xl shadow-md hover:bg-[#1A1A1A] w-full font-medium transition">Bloquear Fecha</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#F8E9E7] p-8">
        <h3 className="text-2xl font-serif mb-6 border-b border-[#F8E9E7] pb-4 font-light text-[#2C2C2C]">Tus Días Inhabilitados</h3>
        <ul className="space-y-4">
          {days.map(d => (
            <li key={d.id} className="flex justify-between items-center p-4 bg-[#FCFBF8] border border-gray-100 rounded-2xl">
              <div>
                <p className="font-semibold text-[#2C2C2C]">{format(parseISO(d.date), "dd 'de' MMMM, yyyy", {locale: es})}</p>
                {d.reason && <p className="text-sm text-[#D8A7B1] font-light mt-1">{d.reason}</p>}
              </div>
              <button onClick={()=>remove(d.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition"><Trash2 size={16}/></button>
            </li>
          ))}
          {days.length === 0 && <p className="text-[#6B6B6B] text-sm font-light text-center py-6">Agenda totalmente disponible y lista.</p>}
        </ul>
      </div>
    </div>
  );
}

function PortfolioTab() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get('/portfolios').then(res => setItems(res.data)).catch(console.error);
  useEffect(() => { load() }, []);

  const store = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor selecciona una foto de tu PC o celular.");
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      await api.post('/portfolios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null); setTitle(''); setDescription('');
      load();
    } catch(err) { 
      alert("Error al subir imagen: " + (err.response?.data?.message || err.message)); 
    } finally {
      setUploading(false);
    }
  };

  const remove = (id) => { 
    if(confirm("¿Seguro que quieres borrar este trabajo?")) {
      api.delete(`/portfolios/${id}`).then(load).catch(console.error); 
    }
  };

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-sm border border-[#F8E9E7] p-8 mb-10 max-w-3xl">
        <h3 className="text-3xl font-serif mb-6 border-b border-[#F8E9E7] pb-4 font-light text-[#2C2C2C]">Subir Nuevo Diseño a Galería</h3>
        <form onSubmit={store} className="grid md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2 font-semibold">Seleccionar Foto</label>
            <div className={`border-2 border-dashed ${file ? 'border-[#D8A7B1] bg-[#F9EDE9]' : 'border-gray-200 bg-gray-50'} rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden`}>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload size={30} className={file ? 'text-[#D8A7B1] mb-2' : 'text-gray-400 mb-2'} />
              {file ? <span className="text-sm font-medium text-[#2C2C2C]">{file.name}</span> : <span className="text-sm font-light text-gray-500">Toca para escoger foto desde tu Teléfono o Computadora</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2 font-semibold">Título Corto (Ej: Baño de Color)</label>
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 border border-gray-200 focus:border-[#D8A7B1] rounded-xl outline-none transition text-[#2C2C2C]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2 font-semibold">Técnica o Materiales (Opcional)</label>
            <input type="text" value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-3 border border-gray-200 focus:border-[#D8A7B1] rounded-xl outline-none transition text-[#2C2C2C]" />
          </div>
          <div className="col-span-full pt-4">
             <button disabled={uploading} className="bg-[#D8A7B1] hover:bg-[#C8949E] text-white px-8 py-3 rounded-xl shadow-md w-full md:w-auto font-medium transition disabled:opacity-50 flex items-center justify-center gap-2">
               {uploading ? 'Subiendo archivo...' : 'Guardar y Mostrar en Galería'}
             </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(i => (
          <div key={i.id} className="relative group rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <img src={i.image_url} className="w-full h-64 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
              <h4 className="text-white font-serif text-xl">{i.title}</h4>
              <p className="text-white/70 text-sm font-light leading-snug mt-1">{i.description}</p>
            </div>
            <button onClick={()=>remove(i.id)} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700 transition transform translate-y-2 group-hover:translate-y-0" title="Eliminar diseño"><Trash2 size={18}/></button>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-center text-gray-400 font-light py-10">Tu galería de inspiración está vacía.</p>}
      </div>
    </div>
  );
}

import React from 'react';

const NoAuthMessage = () => {
    return (
        <div className="relative h-full bg-indigo-900">
            {/* Contenedor para el logo en la esquina superior izquierda */}
            <div className="absolute top-0 left-0 p-8">
                <div className="hover:cursor-pointer" onClick={() => window.open('https://flyup.ar', '_blank')}>
                <img src="https://fly-up-ui.onrender.com/img/Logo-W.png" alt="Logo" className="w-32" />
                </div>
            </div>

            {/* Contenedor para el mensaje centrado */}
            <div className="flex flex-col justify-center items-center h-full">
                <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">
                <p className="text-xl font-semibold text-gray-700">
                    ¡Parece que eres nuevo por aquí! Para poder acceder a la información sobre la actividad de tu AVI, 
                    necesitas que un administrador de Fly-Up te conceda los permisos necesarios.
                </p>
                <p className="mt-4 text-lg text-gray-600">
                    Si tienes alguna duda o deseas obtener acceso, puedes contactarte con nuestro equipo de soporte o un administrador a través de nuestro correo 
                    <a href="mailto:soporte@flyup.ar" className="text-blue-500 underline hover:text-blue-700"> soporte@flyup.ar</a>.
                </p>
                <p className="mt-2 text-lg text-gray-600">
                    Además, si estás interesado en implementar AVI para tu negocio, un vendedor de nuestro equipo puede brindarte más información.
                    ¡No dudes en visitar nuestra web <a href="https://www.flyup.ar" className="text-blue-500 underline hover:text-blue-700">www.flyup.ar</a> para conocernos más!
                </p>
                <p className="mt-6 text-lg text-gray-600">
                    ¡Gracias por tu interés en Fly-Up! Estamos aquí para ayudarte en todo lo que necesites.
                </p>
                </div>
            </div>
        </div>
    );
};

export default NoAuthMessage;
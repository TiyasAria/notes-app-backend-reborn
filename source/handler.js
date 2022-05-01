const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {

    const {title , tags , body }  = request.payload ; 
    //  kita akan pasang library nanoid (untuk menangani id yang unik), 
    // untuk memasang nanoid, hanya tinggal panggi saja dab kita masukan didalam nya adalah max string yang nanti nya harus diiisi
    const id = nanoid(16);
    //  sekarang kitaa akan menangani untuk bagian cretedAT dan updateAt 
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    //  ketika kita sudah membuat komponen nya secara lengkap , tinggal kita masukan kedalam notes.js kita , cara nya kita masukan 
    //  dalam bentuk array terlebih dahulu 

    const newNotes = {
        title, tags , body , id , createdAt , updateAt
    };

    notes.push(newNotes);

    //  setelah kita push , array obejct komponen ke dalam var notes yang isinya array kosong kita , sekrang kita
    // kita akan coba check untuk melihat apakah newNotes ini masuk kedalam notes yang isinyaa array kosong kita dg membuat var isSuccess

    const isSuccess = notes.filter((note) => note.id === id).length > 0 ;

    if(isSuccess) {
        const response = h.response({
            status : 'success', 
            message : 'Catatan  berhasil di buat yaa :)', 
            data : {
                noteId : id ,
            },
        });

        response.code(201);
        return response; 
    };


    const response = h.response({
        status : 'failed', 
        message : 'Catatan  tidak berhasil dibuat',
    });
    response.code(500);
    return response;
};

const getAllNoteHandler = () => ({
 status : 'Success',
 data : {
     notes
 }
});

const getNoteByIdHandler = (request , h) => {
    //  karena id digunakan sebagai sebuah param jadi kita dapatkan dulu idnya ini menggunakan method param 
    const {id} = request.params ; 

//  setelah ddapat id , dapatkan object note (1 note) didalam array notes kita tadi 

     const note = notes.filter((n) => n.id === id) [0];

     if (note !== undefined) {
         return {
             status : 'data berhasiil diambil ', 
             data : {
                 note
             }
         }
     }

     const response =  h.response({
            status : 'Data failed',
            message : 'Data tidak berhasil diambil secara ID'
     });

     response.code(404);
     return response ;
} ;

const editNoteHandler = (request , h) => {
    const {id} = request.params;

    const {title, tags , body} = request.payload;
    const updateAt = new Date().toISOString();

    //  sekarang kita daopatkan dulu index dari catatannya kemudian setelah mendapat index baru kita update datanya 

    const index = notes.findIndex((note) => note.id === id);
    //  buat percabangan untuk mengatur responnya 
    if (index !== -1){
        notes[index] = {
            ...notes[index],
            title , 
            tags , 
            body , 
            updateAt 
        }

        const response = h.response({
            status : "success", 
            message : "data berhaasil di update", 
        });

        response.code(200);
        return response ; 
    }


    const response = h.response({
        status : 'failed',
        message : 'Data tidak berhasil di update',
    }); 
    response.code(404);
    return response;


}; 

const deleteNoteHandler = (request , h) => {
    const {id} = request.params ; 

    const index = notes.findIndex((note) => note.id === id) ; 
    if(index !== -1){
        notes.splice(index , 1);
         const response = h.response(
             {
                 status : 'success', 
                 mesage : 'Data berhasil di hapus'
             }
         );

         response.code(200);
         return response;
    }

    const response = h.response({
        status : 'Failed', 
        message : 'Data gagal dihapus'
    });
    response.code (404);
    return response ; 
}

module.exports = {
    addNoteHandler,
     getAllNoteHandler, 
     getNoteByIdHandler,
    editNoteHandler, 
    deleteNoteHandler
}
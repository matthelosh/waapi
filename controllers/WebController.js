const web = {
    home: (req, res) => {
        res.render('index', {title: 'Selamat Datang', message: 'Salam. Silahkan memanfaatkan API Whatsapp Mandita', headers: req.header('User-Agent')});
    }
}


module.exports = web
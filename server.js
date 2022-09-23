const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const upload = require('./ImageUploader')  

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://cryptotattoo:tattoocrypto@cluster0.x3sq521.mongodb.net/?retryWrites=true&w=majority', function (에러, client) {

    if (에러) return console.log(에러)

    db = client.db('chichi');

    db.collection('dooboo').insertOne({ 이름: 'hayoung', 나이: 29 }, function (에러, 결과) {

        console.log('저장완료');
    });

});



app.get('/', function (요청, 응답) {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/write', function (요청, 응답) {
    응답.sendFile(__dirname + '/write.html')
});




app.post('/add', function (요청, 응답) {
    응답.send('전송완료');
    db.collection('counter').findOne({ name: '게시물갯수' }, function (에러, 결과) {
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;

        db.collection('dooboo').insertOne({ _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date }, function (에러, 결과) {
            console.log('저장완료');
            //    counter라는 콜렉션에 있는 totalPost라는 항목도 1 증가시켜야 함.
            db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, function (에러, 결과) { });
        });


    });

});

 

app.get('/list', function (요청, 응답) {

    db.collection('dooboo').find().toArray(function (에러, 결과) {
        console.log(결과);
        응답.render('list.ejs', { posts: 결과 });
    });
//dd
});

app.delete('/delete', function (요청, 응답) {
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    db.collection('dooboo').deleteOne(요청.body, function (에러, 결과) {
        console.log('삭제완료료');
        응답.status(200).send({ message : '성공했습니다'});
    });
});

const fields = upload.upload.fields([{name: 'photo', maxCount: 1}, {name: 'thumbnail', maxCount: 1}]) 

app.post('/s3up', fields, async (req, res) => {
	const photo = req.files['photo'][0];
  	const thumbnail = req.files['thumbnail'][0];
  	
  	console.log(photo, thumbnail);
});

app.listen(8090);


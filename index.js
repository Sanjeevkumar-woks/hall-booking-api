import express from "express";
const app=express();
const path = require('path');
const PORT=process.env.PORT || 9000;
app.use(express.json());

//Home Route
app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(PORT,()=>console.log("Server is Up and Running On",PORT));

// ROOMS DATA

const rooms=[
    {
        id:"100"+500*6,
        capasity:200,
        name: "SM Part Hall",
        amenities:[
            "Ac Hall",
            "Parking",
            "Music System"
        ],
        price_per_hr:1000,
        PreviousBookingData:[

            {
                roomName:"S M Party Hall",
                bookingId: "100300001",
                clientName:"Sanjeev M",
                date:"25/12/2021",
                startTime:"11:00",
                endTime:"18:00",
                totalTime:7,
                amount:7000
            },
            {
                roomName:"S M Party Hall",
                bookingId: "100300001",
                clientName:"Sanjeev M",
                date:"2/1/2022",
                startTime:"6:00",
                endTime:"18:00",
                totalTime:12,
                amount:12000  
            }
        ],
        
    },
    {
        id:"100"+3500*6,
        capasity:50,
        name: "SM Meeting Hall",
        amenities:[
            "Ac Hall",
            "Internet",
            "Mic and speakers",
            "Projector"
        ],
        price_per_hr:3000,
        PreviousBookingData:[
{
    roomName:"S M Meeting Hall",
                bookingId: "100303",
                clientName:"Sanju M",
                date:"1/1/2022",
                startTime:"13:00",
                endTime:"18:00",
                totalTime:5,
                amount:15000  
},
{
    roomName:"S M Meeting Hall",
    bookingId: "100303",
    clientName:"Manju M",
    date:"11/1/2022",
    startTime:"11:00",
    endTime:"18:00",
    totalTime:7,
    amount:21000,  

}],

}];

//All Bookings
const bookings=[
    {
        roomName:"S M Meeting Hall",
                    bookingId: "100303",
                    clientName:"Sanju M",
                    date:"1/1/2022",
                    startTime:"13:00",
                    endTime:"18:00",
                    totalTime:5,
                    amount:15000  
    },
    {
        roomName:"S M Meeting Hall",
        bookingId: "100303",
        clientName:"Manju M",
        date:"11/1/2022",
        startTime:"11:00",
        endTime:"18:00",
        totalTime:7,
        amount:21000,  
    
    },
    {
        roomName:"S M Party Hall",
        bookingId: "100300001",
        clientName:"Sanjeev M",
        date:"25/12/2021",
        startTime:"11:00",
        endTime:"18:00",
        totalTime:7,
        amount:7000
    },
    {
        roomName:"S M Party Hall",
        bookingId: "100300001",
        clientName:"Sanjeev M",
        date:"2/1/2022",
        startTime:"6:00",
        endTime:"18:00",
        totalTime:12,
        amount:12000  
    }
];

//Customers

const customers=[
    {
        cosName:'Sanjeev M',
        bookings:[
            {
                roomName:"S M Party Hall",
                bookingId: "100300001",
                clientName:"Sanjeev M",
                date:"25/12/2021",
                startTime:"11:00",
                endTime:"18:00",
                totalTime:7,
                amount:7000
            },
            {
                roomName:"S M Party Hall",
                bookingId: "100300001",
                clientName:"Sanjeev M",
                date:"2/1/2022",
                startTime:"6:00",
                endTime:"18:00",
                totalTime:12,
                amount:12000  
            }]
    },
    {
        cosName:'Sanju M',
        bookings:[
            {
                roomName:"S M Meeting Hall",
                            bookingId: "100303",
                            clientName:"Sanju M",
                            date:"1/1/2022",
                            startTime:"13:00",
                            endTime:"18:00",
                            totalTime:5,
                            amount:15000  
            }
            
        ]
    },
    {
        consName:'Manju M',
        bookings:[
            {
                roomName:"S M Meeting Hall",
                bookingId: "100303",
                clientName:"Manju M",
                date:"11/1/2022",
                startTime:"11:00",
                endTime:"18:00",
                totalTime:7,
                amount:21000,  
            }
        ]
    }
];

//All Rooms
app.get("/rooms",(req,res)=>{
    res.send(rooms);
});

//Booking a Room
app.post("/room/:id",(req,res)=>{
    let clientData=req.body;
    let id=req.params.id;
    let customer=customers.filter(
        (user)=>user.name===clientData.clientName);
        //get customer data || check user avilable
        let room= rooms.filter((room)=>room.id===`${id}`);
        //get room data
        if(room.length>0){
            let{ PreviousBookingData, price_per_hr,name}=room[0];
        
        
        //Time Calculation 
        let {startTime, endTime, date} = clientData

    let start  = startTime.split(':'),startMin = start[1] === '00'? 0 : +start[1]/60
   
    let end = endTime.split(':'),endMin = end[1] === '00'? 0 : +end[1]/60
  
    let rangeHr =  +end[0] - +start[0], rangeMin = Math.abs(+endMin - +startMin), timeRange = rangeMin === 0 ? rangeHr : rangeHr + rangeMin

    let availability=true;
    

    // check availability
    bookings.forEach((book)=>{
        if(date === book.date && +start[0] >= +book.startTime.split(':')[0]  && start[0] <= +book.endTime.split(':')[0]  ){
            availability = false
        }
      })

      if(availability){
        // add data to rooms
        PreviousBookingData.push({
            ...clientData,totalTime:timeRange,
            roomId:id,
            amount:price_per_hr*timeRange,
            bookingId:`${id}${PreviousBookingData.length+1}`,
            roomName:name,
            bookedStatus:true,
            isCheckedIn:false,
        });

        //Add bookig details to coustomer's data or if customer doesnot exist add new customer.

        customer.length > 0
        ? customer[0].bookings.push({
            startTime: clientData.startTime,
            endTime: clientData.endTime,
            totalTime:timeRange,
            date: clientData.date,
            roomId: id,
            amount: price * timeRange,
            bookingId: `${id}${bookedData.length + 1}`,
            roomName: name,
            bookedStatus: true,
            isCheckedIn: false,
          })
        : customers.push({
            name: clientData.clientName,
            bookings: [
              {
                startTime: clientData.startTime,
                endTime: clientData.endTime,
                totalTime:timeRange,
                date: clientData.date,
                roomId: id,
                amount: price * timeRange,
                bookingId: `${id}${bookedData.length + 1}`,
                roomName: name,
                bookedStatus: true,
                isCheckedIn: false,
              },
            ], 
          });

          res.send({
            lastBookingData: {
              ...clientData,
              totalTime:timeRange,
              roomId: id,
              amount: price * timeRange,
              bookingId: `${id}${bookedData.length + 1}`,
              roomName: name,
              bookedStatus: true, // status = 'booked' = true || 'canceled' = false
              isCheckedIn: false,
            },
            bookedData: bookedData,
          });
        } else {
            res.send({
              bookingStatus: false,
              message: "no availability",
            });
          }
        }  else {
            res.send(401, { error: "invalid link" });
          }   
});

//Create Room
app.post('/create-room',(req, res)=>{
    let roomData = req.body;
    let makeRoom = {
      id: `${roomData.capasity}` + roomData.price_per_hr * 5,
      ...roomData,
      PreviousBookingData:[]
    }
    rooms.push(makeRoom)
    res.send({status: true, room : makeRoom})
  })

app.get("/bookings", (req, res) => {
    res.send(bookings);
   });
   
   app.get("/customers", (req, res) => {
     res.send(customers);
   }); 

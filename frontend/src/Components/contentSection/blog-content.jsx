

export default function BlogContent(){

    const listArr = [{name: 'Raas',goal: 'Be Positive', image:"https://images.unsplash.com/photo-1432298026442-0eabd0a98870?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZW4lMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D"},
    {name: 'Faiq',goal: 'Be Polite', image:"https://images.unsplash.com/photo-1717647439287-f3e94e3fb924?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JlZW4lMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D"},
    {name: 'Raza',goal: 'Be strong', image:"https://images.unsplash.com/photo-1715731456084-2165629dfe4f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdyZWVuJTIwbmF0dXJlfGVufDB8fDB8fHww"},
    {name: 'Bashir',goal: 'Shinning', image:"https://images.unsplash.com/photo-1700831359498-7e367ee09472?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdyZWVuJTIwbmF0dXJlfGVufDB8fDB8fHww"},
    {name: 'Fatima',goal: 'Believer', image:"https://m.media-amazon.com/images/I/610+t0Qk54L._AC_UF1000,1000_QL80_.jpg"}
    ];

    return (
        <div className="flex xs:flex-col sm:flex-row">
            <div className="blogsContainer xs:w-[95vw] w-[70vw] ">
                <div className="flex flex-wrap gap-5 text-center justify-center">
                {listArr.map((item,index) => {
                    return (
                        <div key={index} className="flex flex-col">
                            <h2 key={index} className="ml-3 p-4 text-xl"> {item.name} </h2>
                            <img src={item.image} className="w-[260px] h-[210px] object-cover" alt={item.name} /> 
                            <h2 className="ml-3 p-4 text-xl"> {item.goal} </h2>                       
                        </div>
                    )
                    
                })}
                </div>
            </div>
            <div className="mt-5 p-4 w-[30vw] text-center relative xs:hidden sm:block">
                <>
                    <h2 className="font-extrabold "> About Raas </h2>
                    <img src="https://wallpapers.com/images/hd/greenery-background-abj04ct0og086pp4.jpg" 
                    alt="greenry"
                    className="w-auto md:h-h-[210px] mx-auto " />
                    <h2 className="font-bold mt-4"> Goal</h2>
                    <h3> Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Maxime, nobis tempore! Ea odit officiis laborum mollitia in accusantium, magni veritatis, 
                        quae tenetur vero reprehenderit voluptas at non nemo dolor ducimus? </h3>
                    <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400"> Interest </h3>
                    <span className="border-t border-blue-400"></span>
                    <div>

                        <h5>Religions</h5>
                        <h5>Islam</h5>
                        <h5>International Politics</h5>
                        <h5>Technology</h5>
                        <h5>Innovation</h5>
                    </div>
                </>
                
            </div>

            <div className="flex justify-center">
                <button className="xs:block sm:hidden border bg-green-400 text-center p-3 hover:bg-green-200">About Me</button>
            </div>
        </div>
    )

}
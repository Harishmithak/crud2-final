//load table 

function loadTable() {
    const xhttp = new XMLHttpRequest(); 
    xhttp.open("GET", "http://localhost:3000/events");
    xhttp.send();
    
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var trHTML = "";
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += "<tr>";
          trHTML += "<td>" + object["id"] + "</td>";
          trHTML +=
            '<td><img width="50px" src="' +
            object["avatar"] +
            '" class="avatar"></td>';
          trHTML += "<td>" + object["ename"] + "</td>";
          trHTML += "<td>" + object["cname"] + "</td>";
          trHTML += "<td>" + object["session"] + "</td>";
          trHTML += "<td>" + object["venue"] + "</td>";
          trHTML += "<td>" + object["date"] + "</td>";
          trHTML +=
            '<td><button type="button" id="edit"  class="btn btn-outline-secondary" onclick="showUserEditBox(' +
            object["id"] +
            ')">Edit</button>';
          trHTML +=
            '<button type="button" id="del" class="btn btn-outline-danger" onclick="userDelete(' +
            object["id"] +
            ')">Del</button></td>';
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
      }
    };
  }
  
  loadTable();


  //show create box
  function showUserCreateBox() {
   
    Swal.fire({
      title: "Create user",
      html:
      '<form id="myform"  class="was-validated">'+
        '<input id="id" type="hidden">' +
        '<input id="ename" class="swal2-input" placeholder="event name" required>' +
        '<input id="cname" class="swal2-input" placeholder="customer name" required>' +
        '<input id="session" class="swal2-input" placeholder="session" required>' +
        '<input id="venue" class="swal2-input" placeholder="venue" required>'+
        '<input id="date" class="swal2-input" placeholder="date" required>'+
        '</form>',

        preConfirm: async () => {
            const form = document.getElementById('myform');
            if (!form.checkValidity()) {
              Swal.showValidationMessage('Please fill out all required fields.');
              return;
            }
            try {
              userCreate();
              Swal.fire({
                icon: "success",
                title: "event added successfully",//for success message
               
              });
              loadTable();
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
              });
            }
      },
    });
  }
  
  function userCreate() {
    const ename = document.getElementById("ename").value;
    const cname = document.getElementById("cname").value;
    const session = document.getElementById("session").value;
    const venue = document.getElementById("venue").value;
    const date = document.getElementById("date").value;
   
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/events");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
      
        ename: ename,
        cname: cname,
        session: session,
        venue: venue,
        date: date,
         avatar: "assets/images/2.png",
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects["message"]);
        loadTable();
      }
    };
  }

  //show edit box
  function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET",`http://localhost:3000/events/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
      
        console.log(objects);
        Swal.fire({
          title: "Edit Event",
          html:
            '<input id="id" type="hidden" value="' +
            objects[`${id}`] +
            '">' +
            '<input id="ename" class="swal2-input" placeholder="event name" value="' +
            objects["ename"] +
            '">' +
            '<input id="cname" class="swal2-input" placeholder="customer name" value="' +
            objects["cname"] +
            '">' +
            '<input id="session" class="swal2-input" placeholder="session" value="' +
            objects["session"] +
            '">' +
            '<input id="venue" class="swal2-input" placeholder="venue" value="' +
            objects["venue"] +
            '">'+
            
            '<input id="date" class="swal2-input" placeholder="date" value="' +
            objects["date"] +
            '">',
          preConfirm: () => {
            userEdit(id);
          },
        });
      }
    };
  }
  
  function userEdit(id) {
  
    const ename = document.getElementById("ename").value;
    const cname = document.getElementById("cname").value;
    const session = document.getElementById("session").value;
    const venue = document.getElementById("venue").value;
    const date = document.getElementById("date").value;
    console.log(id);
    console.log(ename);
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT",`http://localhost:3000/events/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
     
     
        ename: ename,
        cname: cname,
        session: session,
        venue: venue,
        date: date,
        avatar: "assets/images/2.png",
   
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
         Swal.fire(objects["message"]);
        loadTable();
      }
    };
  }
 //delete
  function userDelete(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open(`DELETE`,`http://localhost:3000/events/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
          id: id,
        })
      );
    
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        
        
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
          timer: 5000 //5 seconds
      }).then((result) => {
          if (result.value) {
              objects["message"];
          }
      })
      }
     
    };
   
  }

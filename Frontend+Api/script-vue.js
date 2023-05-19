// import axios from 'axios';

Vue.createApp({

    
    data() {
        return {
            text: '',
            editTodoText: '',
            is_login: false,
            email: '',
            password: '',
            baseUrl:'http://127.0.0.1:5000/api/v1',
            newSubTodoText:null,
            user:{
                email:null,
                name:null,
                username:null,
                password:null,
            },
            task : {
                text:null,
                idU:null,
            },
            users: [
                {email: 'test1', password: 'password'},
            ],
            todos: [
                // {
                //     text: 'Learn Node ', completed: false, date: '2022-01-01', date_completed: null, subTodos: [
                //         {text: 'Learn Node js (Sub1)', completed: true, date: '2022-01-01'},
                //         {text: 'Learn Node js (Sub2)', completed: false, date: '2022-01-01'}
                //     ]
                // },
                // {text: 'Learn Vue', completed: false, date: '2022-02-01', date_completed: null, subTodos: []},
               
            ],
            sortOption: 'selected' // الخيار الافتراضي هو تاريخ الإضافة
        }
    },
   
    
    mounted(){
        new Sortable(document.getElementById('todoList'));
        if(window.location.href.includes('index.html')){

            axios.get(this.baseUrl+'/mission/GetMission', {
                headers: {
                    'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                }
            }).then(  ({data}) => {
                this.todos = data.data
            }).catch(error => {
                if (error.status) {
                    var statusCode = error.status;
                    // Use the statusCode as needed
                    console.log("Status code: " + statusCode);
                }
                alert("Unauthorized");
            });
        }
    },
    methods: {

        logout(){
          localStorage.clear()
            window.location.reload()
        },


        // الأساليب هنا
        addTodo() {
            if (this.task.text == '' || !this.task.text) {
                alert("أدخل نص");
                return;
            }
            this.task.idU = this.getUser._id
            axios.post(this.baseUrl+'/mission/CreateMission' ,this.task,
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                this.getAllMissions()

            }).catch(error => {
                alert(error.response.data.error);
            });




        },

        editTodo(key,todo){
            todo.text = this.editTodoText
            this.editTodoText = ''
            this.editTodoText = todo.text

            axios.post(this.baseUrl+'/mission/UpdateMissionById/'+todo._id ,{text:this.editTodoText},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {

                this.getAllMissions()


            }).catch(error => {
                alert(error.response.data.message);
            });
            $('#editTask' + todo._id).modal('hide')
        },
        calculateDailyProgress() {
            const currentDate = new Date().toISOString().slice(0, 10);
            const todayTasks = this.todos.filter(todo => todo.created_at === currentDate);
            const todayTasksCount = todayTasks.length;
            const todayCompletedCount = todayTasks.filter(todo => todo.status).length;
            const progressPercentage = todayTasksCount === 0 ? 0 : Math.round((todayCompletedCount / todayTasksCount) * 100);
            alert(`متوسط نسبة الإنجاز في اليوم هي ${progressPercentage}%`);
        },


        markTodoComplete(key,todo) {
            var currentDate = new Date();
            this.task.idU = this.getUser._id
            axios.post(this.baseUrl+'/mission/UpdateMissionById/'+todo._id ,{status:true,completedOn:currentDate},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                this.getAllMissions()


            }).catch(error => {
                alert(error.response.data.message);
            });

        },
        markTodoIncomplete(key,todo) {
            this.task.idU = this.getUser._id

            axios.post(this.baseUrl+'/mission/UpdateMissionById/'+todo._id ,{status:false,completedOn:null},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                this.getAllMissions()


            }).catch(error => {
                alert(error.response.data.message);
            });
        },
        removeTodo(key, todo) {

            axios.delete(this.baseUrl+'/mission/DeleteMissionById/'+todo._id ,
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                this.getAllMissions()
                // $('#exampleModal' + parent_todo._id).modal('hide')

            }).catch(error => {
                alert(error.response.data.message);
            });
        },

        markSubTodoComplete(key, todo,parent_todo) {
            var currentDate = new Date();

            this.task.idU = this.getUser._id
            axios.post(this.baseUrl+'/mission/UpdateSubMissionById/'+todo._id ,{status:true,completedOn:currentDate},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                this.getAllMissions()
                $('#exampleModal' + parent_todo._id).modal('hide')

            }).catch(error => {
                alert(error.response.data.message);
            });

        },
        markSubTodoIncomplete(key, todo,parent_todo) {
            var currentDate = new Date();

            this.task.idU = this.getUser._id
            axios.post(this.baseUrl+'/mission/UpdateSubMissionById/'+todo._id ,{status:false,completedOn:null},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                axios.post(this.baseUrl+'/mission/UpdateMissionById/'+parent_todo._id ,{status:false,completedOn:null},
                    {
                        headers: {
                            'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                        }
                    }
                ).then(  ({data}) => {
                    this.getAllMissions()
                    $('#exampleModal' + parent_todo._id).modal('hide')


                }).catch(error => {
                    alert(error.response.data.message);
                });


            }).catch(error => {
                alert(error.response.data.message);
            });
        },
        removeSubTodo(key, todo,parent_todo) {
            axios.delete(this.baseUrl+'/mission/DeleteSubMissionById/'+todo._id ,
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                parent_todo.sub_missions.splice(key, 1);
            }).catch(error => {
                console.log(error);
            });

        },
        addSubTodo(task) {
            if (this.newSubTodoText == '' || !this.newSubTodoText) {
                alert("أدخل نص")
                return;
            }
            axios.post(this.baseUrl+'/mission/CreateSubMissions/'+task._id ,{text:this.newSubTodoText},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
               this.getAllMissions()
                $('#exampleModal' + task._id).modal('hide')
                // window.location.reload()

            }).catch(error => {
                alert(error.response.data.error);
            });
        },

        openSubTasks(key,task) {
            $('#exampleModal' + task._id).modal('show')
        },
        closeSubTasks() {
            var modals = document.getElementsByClassName("modal");

// Hide or close each modal
            for (var i = 0; i < modals.length; i++) {
                modals[i].style.display = "none";

            }
        },
        getAllMissions(query = null){
            query = query??'';
            axios.get(this.baseUrl+'/mission/GetMission'+query,
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {
                this.todos =   data.data
                this.newSubTodoText = '';
                this.task.text = '';

            }).catch(error => {

                if (error.status) {
                    var statusCode = error.status;
                    // Use the statusCode as needed
                    console.log("Status code: " + statusCode);
                }
            });
        },
        openEditTask(key,todo) {
            this.editTodoText = todo.text

            axios.post(this.baseUrl+'/mission/UpdateMissionById/'+todo._id ,{text:this.editTodoText},
                {
                    headers: {
                        'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))
                    }
                }
            ).then(  ({data}) => {

                this.getAllMissions()


            }).catch(error => {
                alert(error.response.data.message);
            });
            $('#editTask' + todo._id).modal('show')

        },
        login() {

            if(this.user.password && this.user.username){
                axios.post(this.baseUrl+'/auth/SignIn' ,{username: this.user.username,password: this.user.password,}).then(  ({data}) => {
                    var user =  data.data;
                    localStorage.setItem('user',JSON.stringify(user))
                    localStorage.setItem('token',JSON.stringify(data.token))

                    axios.get(this.baseUrl+'/mission/GetMission', {
                        headers: {
                            'Authorization': 'Bearer '+data.token
                        }
                    }).then(  ({data}) => {
                        this.todos = data.data
                        this.is_login = true
                        localStorage.setItem('is_login',true)
                        window.location.href = 'index.html'

                    })
                    .catch(error => {
                        console.log(error.response)
                        this.is_login = false
                        localStorage.setItem('is_login',false)
                        alert("Unauthorized");
                    });

                }).catch(error => {
                    alert(error.response.data.error);
                });
            }else{
                alert("أدخل بياناتك بشكل صحيح")
            }


           //  var users =  JSON.parse(localStorage.getItem('users'))??[];
           // if(users.find((e)=>(e.email == this.email) && (e.password == this.password))){
           //    this.is_login = true
           //     localStorage.setItem('is_login',true)
           //     window.location.href = 'index.html'
           // }else{
           //     this.is_login = false
           //     localStorage.setItem('is_login',false)
           // }
        },
        registerUser(){
            if(this.user.email && this.user.password && this.user.username && this.user.name){


                axios.post(this.baseUrl+'/auth/Register' , this.user).then(  ({data}) => {
                    var user =  data.data;
                    localStorage.setItem('user',JSON.stringify(user))
                    localStorage.setItem('token',JSON.stringify(data.token))

                    axios.get(this.baseUrl+'/mission/GetMission', {
                        headers: {
                            'Authorization': 'Bearer '+data.token
                        }
                    }).then(  ({data}) => {
                        this.todos = data.data
                        window.location.href = 'index.html'

                    }).catch(error => {
                        alert("Unauthorized");
                    });

                }).catch(error => {
                       alert(error.response.data.error);
                });


            }else{
                alert("أدخل بياناتك بشكل صحيح")
            }
        },
        sortTodos(option) {
            switch (option) {
                case 'dateAdded':
                    var query = '?sortByType=1'
                    this.getAllMissions(query)
                    // this.todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'dateCompleted':
                    var query = '?sortByType=2'
                    this.getAllMissions(query)
                    // this.todos.sort((a, b) => new Date(b.completedOn) - new Date(a.completedOn));
                    break;
                case 'userOrder':
                    var query = '?sortByType=3'
                    this.getAllMissions(query)
                    // this.todos.sort((a, b) => {
                    //     if (a.userOrder && b.userOrder) {
                    //         return a.userOrder - b.userOrder;
                    //     } else if (a.userOrder) {
                    //         return -1;
                    //     } else if (b.userOrder) {
                    //         return 1;
                    //     } else {
                    //         return 0;
                    //     }
                    // });
                    break;
            }
        }
    },

    computed: {
        remaining() {
            return this.todos.filter(todo => !todo.status).length;
        },
        completed() {
            return this.todos.filter(todo => todo.status).length;
        },
        getUser(){
          return JSON.parse(localStorage.getItem('user'))
        },
        percentage() {
            const total = this.todos.length;
            const completed = this.completed;
            if (total === 0) {
                return 0;
            } else {
                return Math.round((completed / total) * 100);
            }
        },
        averageCompletion() {
            const today = new Date().toISOString().slice(0, 10); // حصول على تاريخ اليوم الحالي
            const todayTodos = this.todos.filter(todo => todo.created_at === today); // تصفية المهام بتاريخ اليوم الحالي
            const todayCompleted = todayTodos.filter(todo => todo.status).length; // حساب عدد المهام المكتملة بتاريخ اليوم الحالي
            if (todayTodos.length === 0) { // التأكد من وجود مهام بتاريخ اليوم الحالي
                return 0;
            } else {
                return Math.round((todayCompleted / todayTodos.length) * 100); // حساب متوسط نسبة الإنجاز بتاريخ اليوم الحالي
            }
        },


    }
}).mount('#app');
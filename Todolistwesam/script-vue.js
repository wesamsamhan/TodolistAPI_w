
Vue.createApp({
    
    
    data() {
        return {
            newTodoText: '',
            editTodoText: '',
            is_login: false,
            email: '',
            password: '',
            users: [
                {email: 'test1', password: 'password'},
            ],
            todos: [
                {
                    text: 'Learn Node ', completed: false, date: '2022-01-01', date_completed: null, subTodos: [
                        {text: 'Learn Node js (Sub1)', completed: true, date: '2022-01-01'},
                        {text: 'Learn Node js (Sub2)', completed: false, date: '2022-01-01'}
                    ]
                },
                {text: 'Learn Vue', completed: false, date: '2022-02-01', date_completed: null, subTodos: []},
               
            ],
            sortOption: 'selected' // الخيار الافتراضي هو تاريخ الإضافة
        }
    },
   
    
    mounted(){
        new Sortable(document.getElementById('todoList'));

        // if(localStorage.getItem('is_login') == 'true' ){
        //     window.location.href = 'index.html?logged=true'
        //     if(window.location.logged){
        //         window.location.href = 'index.html'
        //     }
        // }else{
        //     window.location.href = 'login.html?not_logged=true'
        //     if(window.location.not_logged){
        //         window.location.href = 'login.html'
        //     }
        // }
    },
    methods: {
        // الأساليب هنا
        addTodo() {
            if (this.newTodoText == '') {
                return;
            }
            const date = new Date().toISOString().slice(0, 10); // تحديد تاريخ المهمة
            this.todos.push({
                text: this.newTodoText,
                completed: false,
                date: date, // تعيين تاريخ المهمة
                subTodos: [],// إضافة خاصية subTodos كمصفوفة لكل مهمة
            });
            this.newTodoText = '';
        },
        editTodo(key,todo){
            todo.text = this.editTodoText
            this.editTodoText = ''
            $('#editTask' + key).modal('hide')
        },
        calculateDailyProgress() {
            const currentDate = new Date().toISOString().slice(0, 10);
            const todayTasks = this.todos.filter(todo => todo.date === currentDate);
            const todayTasksCount = todayTasks.length;
            const todayCompletedCount = todayTasks.filter(todo => todo.completed).length;
            const progressPercentage = todayTasksCount === 0 ? 0 : Math.round((todayCompletedCount / todayTasksCount) * 100);
            alert(`متوسط نسبة الإنجاز في اليوم هي ${progressPercentage}%`);
        },


        markTodoComplete(key) {
            var is_todo_completed = false;
            this.todos[key].subTodos.forEach(e => {
                if (e.completed) {
                    is_todo_completed = true
                } else {
                    alert("يوجد تاسكات فرعية غير مكتملة")
                    is_todo_completed = false;
                    return;
                }
            })
            if (is_todo_completed || this.todos[key].subTodos.length == 0) {
                this.todos[key].completed = true;
                var date = new Date().toISOString().slice(0, 10); // تحديد تاريخ المهمة
                this.todos[key].date_completed = date
            }
        },
        markTodoIncomplete(key) {
            this.todos[key].completed = false;
            this.todos[key].date_completed = null;
        },
        removeTodo(key, todo) {
            this.todos.splice(key, 1);
        },

        markSubTodoComplete(key, todo) {
            todo.subTodos[key].completed = true;
            var is_todo_completed = false;
            todo.subTodos.forEach(e => {
                if (e.completed) {
                    is_todo_completed = true
                } else {
                    is_todo_completed = false;
                    return;
                }
            })
            if (is_todo_completed) {
                todo.completed = is_todo_completed
                var date = new Date().toISOString().slice(0, 10); // تحديد تاريخ المهمة
                todo.date_completed = date
            }
        },
        markSubTodoIncomplete(key, todo) {
            todo.subTodos[key].completed = false;
            todo.completed = false
            todo.date_completed = null;
        },
        removeSubTodo(key, todo) {
            todo.subTodos.splice(key, 1);
        },
        addSubTodo(task, todo) {
            if (this.newSubTodoText == '') {
                return;
            }
            const date = new Date().toISOString().slice(0, 10);
            task.subTodos.push({
                text: this.newSubTodoText,
                completed: false,
                date: date
            });
            this.newSubTodoText = '';
        },

        openSubTasks(key) {
            $('#exampleModal' + key).modal('show')
        },
        openEditTask(key,todo) {
            this.editTodoText = todo.text
            $('#editTask' + key).modal('show')
        },
        login() {
            var users =  JSON.parse(localStorage.getItem('users'))??[];
            console.log("users",users)
           if(users.find((e)=>(e.email == this.email) && (e.password == this.password))){
              this.is_login = true
               localStorage.setItem('is_login',true)
               window.location.href = 'index.html'
           }else{
               this.is_login = false
               localStorage.setItem('is_login',false)
           }
        },
        registerUser(){
            if(this.email && this.password){
               var users =  JSON.parse(localStorage.getItem('users'))??[];
                users.push({email:this.email,password:this.password})
                localStorage.setItem('users',JSON.stringify(users))
                this.login()

            }else{
                alert("أدخل بياناتك بشكل صحيح")
            }
        },
        sortTodos(option) {
            switch (option) {
                case 'dateAdded':
                    this.todos.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'dateCompleted':
                    this.todos.sort((a, b) => new Date(b.date_completed) - new Date(a.date_completed));
                    break;
                case 'userOrder':
                    this.todos.sort((a, b) => {
                        if (a.userOrder && b.userOrder) {
                            return a.userOrder - b.userOrder;
                        } else if (a.userOrder) {
                            return -1;
                        } else if (b.userOrder) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    break;
            }
        }
    },

    computed: {
        remaining() {
            return this.todos.filter(todo => !todo.completed).length;
        },
        completed() {
            return this.todos.filter(todo => todo.completed).length;
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
            const todayTodos = this.todos.filter(todo => todo.date === today); // تصفية المهام بتاريخ اليوم الحالي
            const todayCompleted = todayTodos.filter(todo => todo.completed).length; // حساب عدد المهام المكتملة بتاريخ اليوم الحالي
            if (todayTodos.length === 0) { // التأكد من وجود مهام بتاريخ اليوم الحالي
                return 0;
            } else {
                return Math.round((todayCompleted / todayTodos.length) * 100); // حساب متوسط نسبة الإنجاز بتاريخ اليوم الحالي
            }
        },


    }
}).mount('#app');
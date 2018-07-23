;(function () {
    'use strict';

    // localStorage部分
    var KEY = "LOCAL_DATA";

    // localStorage初始化
    function initTaskLocalStorage() {
        var data = [];

        if (!getTaskLocalStorage()) {
            data = JSON.stringify(data);
            localStorage.setItem(KEY, data);
        }
    }

    // 获取localStorage
    function getTaskLocalStorage() {
        return JSON.parse(localStorage.getItem(KEY));
    }

    // 根据索引查询localStorage中的task
    function queryTask(index) {
        var tasks = getTaskLocalStorage(),
            t = tasks[index];

        return t ? t : null;
    }

    // 添加task并加入至localStorage
    function addTaskStorage(content, done, description, date) {
        var localData = getTaskLocalStorage();

        localData.push({});
        localStorage.setItem(KEY, JSON.stringify(localData));
        return updateTaskStorage(localData.length-1, content, done, description, date);
    }

    // 根据索引删除localStorage中的task
    function deleteTaskStorage(taskIndex) {
        var localData = getTaskLocalStorage();

        localData.splice(taskIndex, 1);
        localStorage.setItem(KEY, JSON.stringify(localData));
    }

    // 根据索引更新localStorage中的task
    // 更新参数中设置的非null项
    function updateTaskStorage(taskIndex, content, done, description, date) {
        var task = queryTask(taskIndex),
            localData = getTaskLocalStorage();

        if (!task) {
            return ;
        }
        if (content !== null) {
            task.content = content;
        }
        if (done !== null) {
            task.done = done;
        }
        if (description !== null) {
            task.description = description;
        }
        if (date !== null) {
            task.date = date;
        }
        localData[taskIndex] = task;
        localStorage.setItem(KEY, JSON.stringify(localData));
    }

    // 依次按照选定标记，定时日期对localStorage排序
    function sortTaskStorage() {
        var localData = getTaskLocalStorage();

        localData.sort(function (t1, t2) {
            if (t1.done > t2.done) {
                return 1;
            } else if (t1.done < t2.done) {
                return -1;
            } else if (t1.date > t2.date) {
                return 1;
            } else if (t1.date < t2.date) {
                return -1;
            } else {
                return 0;
            }
        });
        localStorage.setItem(KEY, JSON.stringify(localData));
    }


    // 程序主体逻辑部分
    var $taskAddInput = $("#task-add-wrapper input[type='text']"),
        $taskAddSubmit = $("#task-add-wrapper input[type='button']"),
        $taskList = $("ul.task-list");

    initTaskLocalStorage();
    storageTasksRender();

    function storageTasksRender() {
        var localData = getTaskLocalStorage(),
            i;

        if (!localData) {
            return ;
        }
        for (i = 0; i < localData.length; i++) {
            renderTask(localData[i]);
        }
    }

    // 监听新建task事件
    $taskAddSubmit.click(function (event) {
        renderNewTaskHandler();
    });
    $taskAddInput.keyup(function (event) {
        if (event.which === 13) {
            renderNewTaskHandler();
        }
        if (event.which === 27) {
            $taskAddInput.val("");
        }
    });

    function renderNewTaskHandler() {
        var val = getAddInputValue(),
            d = {};

        if (val) {
            d.content = val;
            d.done = false;
            d.description = "";
            d.date = Date.now() + 1000 * 60 * 60 * 2;   //默认两小时后
            renderTask(d);
            addTaskStorage(d["content"], d["done"], d["description"], d["date"]);
            $taskAddInput.val("");
        }
    }

    function renderTask(d) {
        var taskTpl = '<li class="task-item">' +
                        '<input type="checkbox" id="check">' +
                        '<span class="task-content" >' + d.content + '</span>' +
                        '<span class="delete-item"></span>' +
                        '<span class="detail-item"></span>' +
                      '</li>';
        var $task = $(taskTpl),
            $checkbox = $task.find("input[type='checkbox']");

        $checkbox.attr("checked", d.done);
        if (d.done) {
            $task.addClass("deleted-task-item");
        }
        // to do
        $taskList.append($task);
    }

    function getAddInputValue() {
        var val = $taskAddInput.val();

        return val ? val : null;
    }

    // 监听删除task事件
    $taskList.on("click", ".delete-item", function (event) {
        var $p = $(this).parent(),
            index = $p.index();

        $p.fadeOut(300, function () {
            $(this).remove();
        });
        deleteTaskStorage(index);
    });

    // 监听标记task事件
    $taskList.on("click", "input[type='checkbox']", function (event) {
        var $p = $(this).parent(),
            index = $p.index();

        if ($(this).is(":checked")) {
            updateTaskStorage(index, null, true, null, null);
        } else {
            updateTaskStorage(index, null, false, null, null);
        }
        sortTaskStorage();
        $taskList.empty();
        storageTasksRender();
    });
    // 优化标记体验
    $taskList.on("click", ".task-content", function (event) {
        var $checkbox = $(this).siblings("input");

        $checkbox.trigger("click");
    });

})();

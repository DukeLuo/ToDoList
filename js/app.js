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
    function addTaskStorage(content, description, date) {
        var localData = getTaskLocalStorage();

        localData.push({});
        localStorage.setItem(KEY, JSON.stringify(localData));
        return updateTaskStorage(localData.length-1, content, description, date);
    }

    // 根据索引删除localStorage中的task
    function deleteTaskStorage(taskIndex) {
        var localData = getTaskLocalStorage();

        localData.splice(taskIndex, 1);
        localStorage.setItem(KEY, JSON.stringify(localData));
    }

    // 更新localStorage中的task
    function updateTaskStorage(taskIndex, content, description, date) {
        var task = queryTask(taskIndex),
            localData = getTaskLocalStorage();

        if (!task) {
            return ;
        }
        if (content) {
            task.content = content;
        }
        if (description) {
            task.description = description;
        }
        if (date) {
            task.date = date;
        }
        localData[taskIndex] = task;
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
        var d = getAddInputValue();
        if (JSON.stringify(d) !== "{}") {
            renderTask(d);
            addTaskStorage(d["content"]);
            $taskAddInput.val("");
        }
    }

    function renderTask(d) {
        var taskTpl = '<li class="task-item">' +
                        '<input type="checkbox">' +
                        '<span class="task-content" >' + d.content + '</span>' +
                        '<span class="delete-item"></span>' +
                        '<span class="detail-item"></span>' +
                      '</li>';

        $taskList.append(taskTpl);
    }

    function getAddInputValue() {
        var val = $taskAddInput.val(),
            d = {};

        if (val) {
            d["content"] = val;
        }
        return d;
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

})();

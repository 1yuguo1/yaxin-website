<template>
    <div class="form" v-loading="isResult">
        <div class="title">
            <span>标题/板块名称：</span>
            <el-input style="width: 80%;" v-model="title"></el-input>
        </div>
        <div class="content">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <Editor style="height: 80%; overflow-y: hidden" v-model="content" :defaultConfig="editorConfig" :mode="mode"
                @onCreated="handleCreated" />
        </div>
        <div class="bottom">
            <el-button @click="submit(1)" type="danger">提交</el-button>
            <el-button @click="submit(0)">保存为草稿</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
    </div>
</template>
<script setup>
import { ref,shallowRef,defineProps } from 'vue';
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { defineEmits } from 'vue';
import http from '@/utils/http';
import { update } from 'lodash';

const emits = defineEmits(['cnacel','update'])
const props = defineProps({

  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  article_id: {
    type: Number,
    required: true
  }
});

let title = ref(props.title)
let isResult = ref(false)
const editorRef = shallowRef();
const mode = "default";

const content = ref(props.content)
const toolbarConfig = {
    toolbarKeys: [
        "headerSelect",
        "bold",
        "italic",
        "underline",
        "justifyCenter",
        "justifyJustify",
        "justifyLeft",
        "justifyRight",
        "bulletedList",
        "numberedList",
        "color",
        "insertLink",
        "fontSize",
        "lineHeight",
        "indent",
        "delIndent",
        "divider",
        "insertTable",
        "undo",
        "redo",
        "clearStyle",
        "fullScreen",
        "blockquote",
        "codeBlock",
        "insertImage",
        "insertVideo"
    ]
};

const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {
        uploadImage: {
            server: "https://your-upload-server.com/upload",
            fieldName: "file"
        }
    }
};

const handleCreated = (editor) => {
    editorRef.value = editor;
};

const cancel = () => {
    emits('cancel');
}

const submit = (enum_) => {
    isResult.value = true
    const data = {'article_id':props.article_id,'title':title.value,'content':content.value,'is_published':enum_}
    http.post('/updateArticle',data).then((res)=>{
        isResult.value = false
        cancel()
        if(res.data.code != 200){
            alert('上传失败')
        }
        else{
            emits('update')
        }   
    })
}
</script>
<style scoped>
.form {
    width: 65%;
    height: 80%;
    z-index: 9999;
    background-color: white;
}

.title {
    margin-top: 5%;
    width: 100%;
    height: auto;
}

.content {
    margin-top: 4%;
    width: 100%;
    height: 70%;
}

.bottom {
    margin-top: 2%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>
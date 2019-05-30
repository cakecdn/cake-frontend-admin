<template>
  <card title="节点管理" class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12">
      <el-table
        :data="nodes"
        style="width: 100%"
        @selection-change="selecting"
        v-loading="nodesListLoading"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="id" label="#" align="center" width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="节点名称"
          align="left"
          min-width="150"
          max-width="500"
        >
        </el-table-column>
        <el-table-column
          prop="tag"
          label="节点标签"
          align="left"
          max-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="healthStatus"
          label="健康状态"
          align="center"
          width="110"
          type="date"
        >
        </el-table-column>
        <el-table-column
          prop="remainingTrafficBytes"
          label="剩余流量(GB)"
          align="center"
          width="200"
          type="date"
          :formatter="trafficFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="uploadUrl"
          label="上传地址"
          align="left"
          min-width="200"
          type="date"
        >
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="editNode(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeNode(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<edit-profile-form></edit-profile-form>-->
    </div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="addNode" icon="fa fa-plus"
        >添加节点
      </el-button>
      <el-button
        type="danger"
        @click="batchRemove"
        icon="fa fa-trash"
        :disabled="this.nodesSelected.length === 0"
      >
        批量删除
      </el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="paging"
        :page-size="pager.size"
        :total="pager.total"
        style="float:right;"
      >
      </el-pagination>
    </el-col>

    <!-- 节点标点 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form :model="form" label-width="90px" :rules="formRules" ref="form">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="节点标签" prop="tag">
          <el-input v-model="form.tag" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="剩余流量" prop="remainingTrafficBytes">
          <el-input
            v-model="form.remainingTrafficBytes"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传地址" prop="uploadUrl">
          <el-input v-model="form.uploadUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="下载地址" prop="downloadUrl">
          <el-input v-model="form.downloadUrl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="formSubmit"
          :loading="formSubmitting"
          >提交
        </el-button>
      </div>
    </el-dialog>
  </card>
</template>

<script>
import { mapGetters } from "vuex";
import { listNodes, addNode, editNode, deleteNode } from "../../api/nodes";

export default {
  name: "NodeListTable",
  data: function() {
    return {
      nodes: [],
      nodesSelected: [],
      nodesListLoading: false,
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      form: {
        name: null,
        tag: null,
        uploadUrl: null,
        downloadUrl: null,
        remainingTrafficBytes: 0
      },
      isAdd: true,
      formRules: {
        name: [
          { required: true, message: "节点名不能为空。", trigger: "blur" }
        ],
        tag: [
          { required: true, message: "节点标签不能为空。", trigger: "blur" }
        ],
        uploadUrl: [
          { required: true, message: "节点上传地址不能为空。", trigger: "blur" }
        ],
        downloadUrl: [
          {
            required: true,
            message: "节点下载地址地址不能为空。",
            trigger: "blur"
          }
        ],
        remainingTrafficBytes: [
          {
            required: true,
            message: "节点剩余流量不能为空。",
            trigger: "blur"
          }
        ]
      },
      formVisible: false,
      formSubmitting: false
    };
  },
  methods: {
    listNodes() {
      this.nodesListLoading = true;
      let params = {
        page: this.pager.page - 1,
        size: this.pager.size
      };
      listNodes(params)
        .then(resp => {
          this.nodesListLoading = false;
          this.nodes = resp.data.list;
        })
        .then(error => {
          this.nodesListLoading = false;
        });
    },
    addNode() {
      this.formVisible = true;
      this.isAdd = true;
      this.form = {
        name: null,
        tag: null,
        uploadUrl: null,
        downloadUrl: null
      };
    },
    editNode(row) {
      this.formVisible = true;
      this.isAdd = false;
      this.form = JSON.parse(JSON.stringify(row));
    },
    formSubmit() {
      if (this.isAdd) {
        addNode(this.form)
          .then(resp => {
            this.$message.success("节点添加成功！");
            this.listNodes();
          })
          .catch(error => {
            this.$message.error("节点添加失败：" + error);
          });
      } else {
        editNode(this.form, [this.form.id])
          .then(resp => {
            this.$message.success("节点修改成功！");
            this.listNodes();
          })
          .catch(error => {
            this.$message.error("节点修改失败：" + error);
          });
      }
    },
    batchRemove() {},
    removeNode(row) {
      deleteNode([row.id])
        .then(resp => {
          this.$message.success("节点删除成功！");
          this.listNodes();
        })
        .catch(err => {
          this.$message.error("节点删除失败：" + err);
        });
    },
    paging(val) {
      this.page = val;
      this.listNodes();
    },
    selecting(sels) {
      this.nodesSelected = sels;
    },
    trafficFormatter(row, column) {
      const trafficrc = row[column.property];
      return (trafficrc / 1073741824).toFixed(4);
    },
    pulseTimeFormatter(row) {}
  },
  computed: {
    // ...mapGetters(["currentUser"]),
    formTitle: function() {
      return this.isAdd ? "添加节点" : "编辑节点";
    }
  },
  mounted: function() {
    this.listNodes();
  }
};
</script>

<style scoped lang="scss">
.toolbar {
  padding: 10px;
  //border:1px solid #dfe6ec;
  margin: 10px 0;
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>

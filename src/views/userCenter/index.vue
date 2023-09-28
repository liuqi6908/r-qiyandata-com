<template>
  <!-- 个人中心 -->
  <div class="user_center" v-loading="loading">
    <div
      v-if="
        userInfo.type === '个人用户' &&
          (userInfo.status === '-1' || userInfo.status === '3')
      "
      class="card apply_card"
    >
      <el-card>
        <div slot="header" class="card_header">需要完善信息并通过审核</div>
        <div class="card_body none-scrollbar">
          <el-form
            ref="applyForm"
            label-position="top"
            :model="applyForm"
            :show-message="false"
          >
            <el-form-item prop="name">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                姓名
              </span>
              <el-input
                placeholder="请输入您的真实姓名"
                v-model.trim="applyForm.name"
              />
            </el-form-item>
            <el-form-item prop="unit">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                学校名称：
              </span>
              <el-input
                placeholder="请输入您的学校名称"
                v-model.trim="applyForm.unit"
              />
            </el-form-item>
            <el-form-item prop="college">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                学院名称：
              </span>
              <el-input
                placeholder="请输入您的学院名称"
                v-model.trim="applyForm.college"
              />
            </el-form-item>
            <el-form-item prop="email">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                邮箱：
              </span>
              <el-input
                placeholder="请输入您的邮箱地址"
                v-model.trim="applyForm.email"
              />
            </el-form-item>
            <el-form-item prop="identity">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                身份：
              </span>
              <el-select
                placeholder="请选择您的身份"
                v-model="applyForm.identity"
                style="width: 100%"
              >
                <el-option
                  v-for="item in identityList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="validity">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                身份证明材料有效期：
              </span>
              <el-date-picker
                v-model="applyForm.validity"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                align="center"
                @change="checkValidity"
              />
            </el-form-item>
            <el-form-item prop="db">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                感兴趣的数据库：
              </span>
              <el-select
                placeholder="请选择您感兴趣的数据库（最少1个，最多5个）"
                v-model="applyForm.db"
                multiple
                :multiple-limit="5"
                collapse-tags
                style="width: 100%"
              >
                <el-option
                  v-for="item in dbList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="imageList">
              <span slot="label">
                <span style="color: red; margin-right: 5px">*</span>
                上传资料：
              </span>
              <el-upload
                class="upload"
                :action="'/api/user/verifyImg?time=' + time"
                accept="image/*"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :file-list="fileList"
                :limit="8"
                list-type="picture"
              >
                <el-button class="white_button">
                  <i class="el-icon-picture" style="margin-right: 5px"></i>
                  选择图片<span style="font-size: 12px">（最多8张）</span>
                </el-button>
                <div slot="tip" class="el-upload__tip">
                  学生请上传学生证，教师及其他研究人员请上传校园卡或工作凭证，仅限图片文件，大小不超过
                  2M
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-checkbox
            v-model="applyForm.check"
            class="check"
          >
            <p>
              我已阅读并同意
              <span
                class="agreement"
                @click.stop.prevent="agreementDialog1 = true"
                >《「社科大数据平台」隐私政策》</span
              >
              <br />
              <span
                class="agreement"
                @click.stop.prevent="agreementDialog2 = true"
                >《「社科大数据平台」用户使用协议》</span
              >
            </p>
          </el-checkbox>
          <!-- 申请按钮 -->
          <el-button
            class="blue_button"
            :disabled="disabledApply"
            :class="{ 'is-disabled': disabledApply }"
            @click="apply"
          >
            <i class="el-icon-s-promotion" style="margin-right: 10px"></i>
            提交申请
          </el-button>
        </div>
      </el-card>
    </div>
    <div
      v-else-if="userInfo.type === '个人用户' && userInfo.status === '0'"
      class="card wait_card"
    >
      <el-card>
        <div slot="header" class="card_header">
          您的申请正在审核中，请耐心等待
        </div>
        <div class="card_body none-scrollbar">
          <P style="font-weight: bold; color: black">最近提交的表单：</P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">姓名：</span>
            {{ userInfo.verifyName }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">学校名称：</span>
            {{ userInfo.departent }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">学院名称：</span>
            {{ userInfo.college }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">邮箱：</span>
            {{ userInfo.email }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">身份：</span>
            {{ userInfo.identity }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">身份证明材料有效期：</span>
            {{ userInfo.validity.join(' 至 ') }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">提交时间：</span>
            {{ userInfo.updateTime }}
          </P>
          <!-- 撤销按钮 -->
          <el-button class="red_button" @click="revocation(0)">
            <i class="el-icon-refresh-left" style="margin-right: 10px"></i>
            撤销申请
          </el-button>
        </div>
      </el-card>
    </div>
    <div
      v-else-if="userInfo.type === '个人用户' && userInfo.status === '2'"
      class="card reject_card"
    >
      <el-card>
        <div slot="header" class="card_header" style="color: red">
          您的申请被驳回
          <i class="el-icon-warning"></i>
        </div>
        <div class="card_body none-scrollbar">
          <P style="font-weight: bold; color: black">申请内容：</P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">姓名：</span>
            {{ userInfo.verifyName }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">学校名称：</span>
            {{ userInfo.departent }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">学院名称：</span>
            {{ userInfo.college }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">邮箱：</span>
            {{ userInfo.email }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">身份：</span>
            {{ userInfo.identity }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">身份证明材料有效期：：</span>
            {{ userInfo.validity.join(' 至 ') }}
          </P>
          <P>
            <span style="font-weight: bold; color: #0e68b4">驳回时间：</span>
            {{ userInfo.updateTime }}
          </P>
          <P style="font-weight: bold; color: black; margin-top: 20px"
            >驳回原因：</P
          >
          <div class="reason none-scrollbar">
            {{ userInfo.reject_msg }}
          </div>
          <!-- 重新申请按钮 -->
          <el-button class="blue_button" @click="revocation(1)">
            <i class="el-icon-refresh" style="margin-right: 10px"></i>
            重新申请
          </el-button>
        </div>
      </el-card>
    </div>
    <div v-else-if="userInfo.type === '机构用户'" class="database">
      <div class="content">
        <div>
          <span>欢迎您！</span>
          <span style="font-size: 45px">{{ userInfo.name }}</span>
        </div>
        <div>
          <span>已开通</span>
          <span>{{
            userInfo.total.substring(0, userInfo.total.indexOf("/") + 1)
          }}</span>
          <span style="font-size: 20px">{{
            userInfo.total.substring(
              userInfo.total.indexOf("/") + 1,
              userInfo.total.length
            )
          }}</span>
          <span>个数据库</span>
        </div>
      </div>
      <div class="footer">经济大数据助力中国学术研究与智库建设</div>
    </div>
    <div v-else class="pass_card">
      <el-tabs
        tab-position="left"
        type="border-card"
        :value="activeName"
        class="tabs"
        :class="{ shopping_tab: activeName === '1' }"
        @tab-click="jump"
      >
        <el-tab-pane
          v-for="(item, i) in menuList"
          :key="i"
          :name="item.name"
          :path="item.path"
        >
          <div slot="label" class="not-selected">
            <i :class="item.icon + ' icon'"></i>
            <el-badge
              value="+1"
              :hidden="i !== 3 || !userInfo.newUser"
              class="vip-tab"
            >
              {{ item.label }}
            </el-badge>
          </div>
          <div class="tabs_body">
            <router-view
              v-if="item.name === activeName"
              :key="activeName"
              style="height: 100%"
              class="scrollbar"
              @getUserInfo="getUserInfo"
              @changeActiveName="changeActiveName"
              @IPLogin="IPLogin"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 《「社科大数据平台」隐私政策》 -->
    <el-dialog
      :visible.sync="agreementDialog1"
      width="1200px"
      top="0"
      custom-class="agreementDialog"
      :destroy-on-close="true"
    >
      <div
        class="scrollbar"
        style="
          height: 100%;
          padding: 50px 100px;
          box-sizing: border-box;
          font-size: 16px;
        "
      >
        <h1 style="font-size: 40px">「社科大数据平台」隐私政策</h1>
        <p style="text-align: right">最近更新时间：2021年10月12日</p>
        <p>
          欢迎您使用企研数据科技（杭州）有限公司研发的「社科大数据平台」产品！我们公司非常重视您的隐私保护和个人信息保护。为实现产品功能改善与优化，您在使用我们的服务时，我们可能会收集和使用您的相关信息。我们希望通过《「社科大数据平台」隐私政策》（以下简称《隐私政策》）向您说明，在使用我们的服务时，我们如何收集、使用、储存和分享这些信息，以及我们为您提供的访问、更新、控制和保护这些信息的方式。
        </p>
        <p>
          本《隐私政策》与您所使用的服务息息相关，希望您仔细阅读，在需要时，按照本《隐私政策》的指引，作出您认为适当的选择。本《隐私政策》中涉及的相关技术词汇，我们尽量以简明扼要的方式进行表述，以便您的理解。
        </p>
        <p style="font-weight: bold">
          一旦您开始使用我们的服务，即意味着您已同意我们按照本《隐私政策》收集、使用和共享您的相关信息。
        </p>
        <p>通过本《隐私政策》，您主要可以了解如下内容：</p>
        <ul>
          <li>一、数据/信息的收集</li>
          <li>二、数据/信息的使用</li>
          <li>三、数据/信息的共享</li>
          <li>四、数据/信息的披露</li>
          <li>五、数据/信息的保护</li>
          <li>六、免责条款</li>
          <li>七、隐私政策的更新</li>
          <li>八、联系我们</li>
        </ul>
        <p>以下是本《隐私政策》的详细信息内容：</p>
        <h2 style="font-size: 32px">一、数据/信息的收集</h2>
        <p>
          「社科大数据平台」提供服务时，可能会收集、储存和使用下列与您有关的信息。如果您不提供相关信息，可能无法享受我们提供的某些服务，或者无法达到相关服务预期达到的效果。
        </p>
        <p style="font-weight: bold">
          （1）您直接向「社科大数据平台」提供的数据和个人信息：
        </p>
        <ul>
          <li>
            您因正常使用「社科大数据平台」的功能和服务而需要向我们提供的用户名、头像、手机号码、邮箱、工号/学号等个人信息；
          </li>
          <li>
            您因正常使用「社科大数据平台」的功能和服务而主动上传的个人或第三方数据集；
          </li>
        </ul>
        <p style="font-weight: bold">
          （2）您通过第三方向「社科大数据平台」提供的数据和个人信息：
        </p>
        <p>
          若您通过社交网络的第三方快速登录或与社交网络进行链接，我们会通过第三方获得您的个人信息，这些信息包括但不限于您账户的ID、用户名等。在我们获取您公开的所有信息之前，将征求您的同意与授权。若您不希望或限制「社科大数据平台」收集这些信息，您可以通过第三方平台进行隐私设置等操作，但这将在一定程度上影响您正常使用「社科大数据平台」的服务与功能。
        </p>
        <p style="font-weight: bold">
          （3）「社科大数据平台」自主获取的数据或信息：
        </p>
        <ul>
          <li>
            通过分析或分析工具获取：「社科大数据平台」会对您在使用期间产生的信息或数据直接进行数据分析或使用第三方分析工具进行分析，分析结果将用于帮助我们检查流量、改善服务、优化运营策略等。这些数据或信息由您的浏览器或终端发送提供，包括但不限于访问次数、IP地址、点击次数等；
          </li>
          <li>
            通过日志文件获取：指您使用我们的服务时，系统可能通过cookies、web
            beacon或其他方式自动采集的技术信息，包括：
            <ul>
              <li>
                设备或软件信息：例如您的移动设备、网页浏览器或用于接入我们服务的其他程序所提供的配置信息、您的IP地址和移动设备所用的版本和设备识别码；
              </li>
              <li>
                搜索或浏览的信息：例如您使用的网页搜索词语、访问的社交媒体页面url地址，以及您在使用我们服务时浏览或要求提供的其他信息和内容详情；
              </li>
            </ul>
          </li>
        </ul>
        <h2 style="font-size: 32px">二、数据/信息的使用</h2>
        <p>「社科大数据平台」将对上述收集到的信息进行如下方面的使用：</p>
        <ul>
          <li>记录您的登录或访问信息，方便您能进行正常的登录和访问操作；</li>
          <li>
            验证您的身份信息，以确认您所处的用户角色是否可以正常访问一些限定资源；
          </li>
          <li>帮助我们设计新服务，改善我们的现有服务；</li>
          <li>
            使我们更加了解您如何接入和使用我们的服务，从而针对性地回应您的个性化需求；
          </li>
          <li>向您提供与您更加相关的广告以替代普遍投放的广告；</li>
          <li>评估我们服务中的广告和其他促销及推广活动的效果，并加以改善；</li>
          <li>
            我们将根据数据信息进行分析，对资源进行合理调配，提升用户体验；
          </li>
          <li>
            发现并修复「社科大数据平台」存在的技术问题，实现产品的不断更新。
          </li>
        </ul>
        <p>
          此外，为了在您同意以及符合相关法律法规的前提下改善我们的服务、提供更好的使用体验，我们可能将通过某一项服务所收集的信息，以汇集信息或者个性化的方式，用于我们的其他服务。例如，在您使用我们的一项服务时所收集的信息，可能在另一服务中用于向您提供特定内容，或向您展示与您相关的、非普遍推送的信息。如果我们在相关服务中提供了相应选项，您也可以授权我们将该服务所提供和储存的信息用于我们的其他服务。
        </p>
        <h2 style="font-size: 32px">三、数据/信息的共享</h2>
        <p>
          「社科大数据平台」向您保证：未经您的同意，我们不会以出租、销售等形式将您在「社科大数据平台」上提供和产生的数据信息提供给任何第三方（除“数据/信息的披露”条款中罗列的特殊情况）。
        </p>
        <p>
          但在以下情况中，我们将部分共享您的数据或信息，以便为您提供更好的服务：
        </p>
        <ul>
          <li>
            共享数据/信息给「社科大数据平台」的第三方合作伙伴。我们可能会与协助为您提供服务的第三方平台共享您的部分信息，以便他们能够为您服务，我们保证只提供部分必要的、不涉及隐私的信息，并且保证第三方平台同样遵守本隐私政策。
          </li>
          <li>
            共享某些必要的数据/信息给广告服务提供商。我们可能会将某些信息如您的位置、操作习惯等提供给广告服务提供商，为您提供个性化的广告服务；广告服务提供商也可以通过相关技术手段获知您的IP地址、设备标示符等来向您提供服务并统计广告有效性和服务质量等。我们保证只提供部分必要的、不涉及隐私的信息，并且保证广告服务提供商同样遵守本隐私政策；
          </li>
          <li>
            共享数据/信息给「社科大数据平台」的所有权方。若「社科大数据平台」的所有权在未来发生转移，如出现合并、收购等情况，则上述收集到的数据/信息将作为我们的资产全部移交给所有权方；
          </li>
          <li>
            在必要时共享数据/信息给相关政府部门或第三方。「社科大数据平台」有权应政府部门（包括司法及行政部门）的要求，向其提供您在「
            社科大数据平台」使用过程中提供和产生的注册信息、订阅信息、交易记录等必要信息。如您涉嫌侵犯他人知识产权，「社科大数据平台」亦有权在相关法律法规的要求下，向权利人提供您必要的身份信息。
          </li>
        </ul>
        <h2 style="font-size: 32px">四、数据/信息的披露</h2>
        <p>
          若出现以下情况，「社科大数据平台」将依据您的个人意愿或相关法律规定披露您的个人数据或信息：
        </p>
        <ul>
          <li>经您事先同意，向第三方披露；</li>
          <li>
            若您发起知识产权诉讼，有举证需要的，可在经您同意的情况下披露；
          </li>
          <li>
            若您出现违反中国有关法律、法规或者「社科大数据平台」用户使用协议的情况，可根据相关法律法规向第三方披露；
          </li>
          <li>
            根据法律的有关规定，或行政、司法机构的要求，可向第三方或行政、司法机构披露；
          </li>
        </ul>
        <h2 style="font-size: 32px">五、数据/信息的保护</h2>
        <p>
          「社科大数据平台」将在合法的前提下，为您数据和信息提供权责范围内的存储、备份等安全保护服务：
        </p>
        <p>
          我们会将上述收集到的数据/信息存放在公司自有服务器及中国境内或世界各服务器提供商处，在此过程中我们可能会出于安全考虑和业务需要，对您的数据进行复制、备份、传递，我们将根据所在地的数据保护规定和法律，保护您的数据和信息安全。
        </p>
        <h2 style="font-size: 32px">六、免责条款</h2>
        <p>
          「社科大数据平台」向您保证：除了在本隐私政策已提及的情况外，不会对外公开或提供涉及用户隐私的数据或信息，但发生下列情况时，「社科大数据平台」无需承担任何责任：
        </p>
        <ul>
          <li>
            由于您将注册信息告知他人或与他人共享帐户，由此导致的任何个人资料泄露；
          </li>
          <li>
            任何由于用户自身设备问题、黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常运行之不可抗力而造成的个人资料泄露、丢失、被盗用或被窜改等。
          </li>
        </ul>
        <h2 style="font-size: 32px">七、隐私政策的更新</h2>
        <p>
          「社科大数据平台」团队可以随时对本《隐私政策》进行修改、补充和更新，请用户定期检查本隐私政策的内容。
        </p>
        <h2 style="font-size: 32px">八、联系我们</h2>
        <p>
          如您对本《隐私政策》或相关事宜有任何疑问或建议，请通过邮箱hello@qiyandata.com与我们联系。再次感谢您对企研数据科技（杭州）有限公司的信任！
        </p>
      </div>
    </el-dialog>
    <!-- 《「社科大数据平台」用户使用协议》 -->
    <el-dialog
      :visible.sync="agreementDialog2"
      width="1200px"
      top="0"
      custom-class="agreementDialog"
      :destroy-on-close="true"
    >
      <div
        class="scrollbar"
        style="
          height: 100%;
          padding: 50px 100px;
          box-sizing: border-box;
          font-size: 16px;
        "
      >
        <h1 style="font-size: 40px">「社科大数据平台」用户使用协议</h1>
        <p style="text-align: right">最近更新时间：2021年10月12日</p>
        <p>
          依据《中华人民合同法》的规定，协议双方经协商一致，就「社科大数据平台」的授权使用签订本协议，双方共同信守。
        </p>
        <p>
          您一旦签署本协议，或者以安装、复制、访问或其它形式使用上述产品与服务，即表示您同意接受本协议各项条款的约束。若您不同意本协议中的条款，请勿签署本协议或以任何方式使用上述产品与服务。
        </p>
        <h2 style="font-size: 32px">一、协议名词术语定义</h2>
        <p>
          1.
          “协议”：系指用户（您，个人用户或机构用户）与企研数据科技（杭州）有限公司（以下简称“企研数据”）之间关于「社科大数据平台」（以下简称“平台”）授权使用的具有法律效力的文件，包括所有的附表、附件以及后续可能更新补充的所有内容。
        </p>
        <p>
          企研数据为您提供的服务须受“协议”的约束，并保留随时更新补充“协议”的权利，恕不另行通知。
        </p>
        <p>
          2.
          「社科大数据平台」：系指由企研数据研发的为用户提供海量数据资源查询与下载的一整套解决方案，包括其所涉及到的数据内容、数据库结构、计算机软件等，以及相关的网站、网络服务器和电子文档。企研数据团队对该平台及相关技术具有完全自主知识产权。
        </p>
        <h2 style="font-size: 32px">二、许可权利的授予</h2>
        <p>本协议授予您以下权利：</p>
        <ul>
          <li>
            按要求完善用户信息的注册用户，可登录查询并浏览本平台相关数据资源及文档简介；
          </li>
          <li>
            在获得有效授权的情况下，可登录下载本平台相关数据资源，包括统计数据和部分微观数据。
          </li>
        </ul>
        <p>
          其它任何形式的、未经许可的安装、使用、访问、显示及运行，都将被视为对本协议的侵犯。
        </p>
        <h2 style="font-size: 32px">三、用户的责任和义务</h2>
        <h2 style="font-size: 24px; color: #0e68b4">1. 用户的基本责任</h2>
        <ul>
          <li>
            您在申请登陆、使用本平台时，应当提供真实、准确的个人或单位信息，若个人或单位信息有任何变动，须及时更新；
          </li>
          <li>
            您应当妥善保管您的账号和密码，不得将其售卖、转让、出租、出借或以其它任何形式授权给任何第三方使用；
          </li>
          <li>
            您应当对您账户中发生的活动承担全部责任，若您一旦发现其他个人或单位在您知情或不知情的情况下使用您的密码或账户，应当立即向企研数据通知相关情况；
          </li>
          <li>
            若企研数据因其他个人或单位使用您的账户或密码而蒙受损失，您应当承担相应责任。
          </li>
        </ul>
        <h2 style="font-size: 24px; color: #0e68b4">2. 用户需履行的义务</h2>
        <ul>
          <li>
            您在使用本平台时，不得将服务用于任何非法用途和本协议中已声明禁止的用途；
          </li>
          <li>
            您在使用本平台时，不得以任何方式干扰或限制其他用户使用和享有的任何服务；
          </li>
          <li>
            您在使用本平台时，不得尝试通过入侵、密码盗取或其他任何手段访问、妨碍或损害该平台后端的数据库服务器或网络服务器；
          </li>
          <li>
            您在使用本平台时，需自行配备运行平台所需的各项计算机及网络设备，并自行负担因此所需的各项费用；
          </li>
          <li>
            若您在教学、研究项目、学术或非学术论文及报告等中引用了本平台所提供的数据，则有义务注明数据来源。例如CCAD数据资源的引用规范可参考：“本论文（报告）使用数据全部（部分）来自浙大卡特-企研中国涉农研究数据库（CCAD）”。
          </li>
        </ul>
        <h2 style="font-size: 32px">四、免责条款</h2>
        <ul>
          <li>
            因必要的数据更新和技术升级，企研数据需定期或不定期地对本平台的系统或相关设备进行检修、维护和更新，若因上述情况造成相关服务在合理时间内中断，企研数据将尽力事先进行告知，但对因此造成的不便和损失，企研数据无需承担责任。
          </li>
          <li>
            鉴于网络服务具有不可预见性，您同意企研数据可在任何时候因任何原因变更、中断或终止本平台服务的任何部分，对因此造成的不便和损失，企研数据无需承担责任。
          </li>
          <li>
            企研数据对本平台服务不作任何形式的担保，即不保证服务一定能满足用户的要求，不保证服务不会受任何影响而发生中断，对因此可能造成的不便和损失，企研数据无需承担责任。
          </li>
          <li>
            若用户被认定违反相关条款，企研数据有权取消或停止该协议，并对用户使用本平台的资格和权利加以限制，用户不得要求赔偿或补偿。
          </li>
        </ul>
        <h2 style="font-size: 32px">五、隐私权保护</h2>
        <p>
          保护用户的隐私权不受任何形式的侵犯是企研数据的重要从业原则。企研数据承诺保证用户的账户和密码安全，并保证不以任何方式对外公开或向第三方提供用户隐私信息，但下列情况除外：
        </p>
        <ul>
          <li>事先获得用户的同意和明确授权；</li>
          <li>根据有关的法律法规和相关政府主管部门的要求；</li>
          <li>为维护社会公众的利益；</li>
          <li>为维护企研数据的合法权益。</li>
        </ul>
        <p>
          在不透露单个用户隐私信息的前提下，企研数据有权对所有用户情况进行保存和数据分析，并有权对已进行分析、整理和脱敏后的用户数据用于商务开发和宣传推广。
        </p>
        <h2 style="font-size: 32px">六、著作权声明</h2>
        <p>
          企研数据拥有本平台相关的一切合法版权，受《中华人民共和国著作权法》的保护。本平台中所有相关软件著作权、专利权、商标、商业秘密及其它任何所有权或权利，均属企研数据所有。除用户与企研数据有其他规定外，未经著作权人书面同意，使用者严格禁止有下列行为：
        </p>
        <ul>
          <li>
            未经同意不得以任何方式复制、保存、传播或在网络上陈列本平台中的数据、说明文字等全部或部分内容；
          </li>
          <li>
            未经同意不得以任何方式公开展示和播放本平台中的全部或部分内容；
          </li>
          <li>不得以任何方式售卖、转让、出租或出借本平台账号给其他第三方；</li>
          <li>
            不得对构成本平台的数据、程序和数据库结构进行还原、翻译和改编等任何修改行为；
          </li>
          <li>
            不得对本平台中的系统名称、公司标志、版权信息等内容进行修改或遮盖；
          </li>
          <li>
            不得从事其他违反著作权法、计算机软件保护条例和相关法规的行为。
          </li>
        </ul>
        <p>
          对于违反上述内容的行为，本平台的授权使用协议及相关合同文件立即停止，企研数据将保留提起法律诉讼的权利。
        </p>
        <h2 style="font-size: 32px">七、协议的适用、修改、终止和解释</h2>
        <ul>
          <li>
            本协议适用于一般个人用户和机构客户，对于其它特别的用户，以另外签订的协议内容为准；
          </li>
          <li>
            企研数据有权根据需要对本协议中的有关条文内容作出随时的更新、修改和补充，用户对此表示接受并将切实遵守。若您不同意本协议及随时可能发生的修改、补充，可以主动取消或拒绝本平台提供的服务；
          </li>
          <li>
            若用户经认定确认违反相关条款的、或发生因不可抗力原因阻止或干扰履行本协议情况的、或经双方协商同意后确定不再使用本平台服务的，本协议即告终止；
          </li>
          <li>
            用户应切实遵守本协议及有关法律的规定，企研数据对用户是否违反授权使用条款拥有最终决定权。若企研数据认定用户违反相关条款，用户同意企研数据可以随时终止用户的使用权。
          </li>
        </ul>
        <h2 style="font-size: 32px">八、法律适用及纠纷解决</h2>
        <ul>
          <li>本协议按中华人民共和国法律解释；</li>
          <li>
            双方在协议履行过程中发生的一切争议，均应通过双方友好协商解决。若协商开始后30天还未解决，由守约方所在地仲裁机构仲裁。
            <ul>
              <li>除非双方另行统一，仲裁的官方语言应为中文；</li>
              <li>仲裁裁决应为最终裁决，对双方均具有约束力；</li>
              <li>除另有裁决外，仲裁费由败诉方承担；</li>
              <li>仲裁期间，除正在进行仲裁部分外，协议其它部分继续执行。</li>
            </ul>
          </li>
        </ul>
        <h2 style="font-size: 32px">九、协议生效及其它</h2>
        <ul>
          <li>
            本协议未尽之事宜，双方本着相互信任和谅解的原则，友好协商解决并签订补充协议。补充协议和本协议具有同等法律效力；
          </li>
          <li>本协议自用户确认并开始使用该系统服务之日起即告生效。</li>
        </ul>
      </div>
    </el-dialog>

    <!-- 正在提交申请 -->
    <el-card
      class="load"
      v-if="applyLoading"
      v-loading="applyLoading"
      element-loading-text="正在提交申请"
    >
    </el-card>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    return {
      // 加载页面
      loading: false,
      // 当前登入用户信息
      userInfo: {},
      // 身份列表
      identityList: ['教师', '在读博士', '在读硕士', '在读本科', '在读大专', '其他研究人员'],
      // 感兴趣的数据库
      dbList: [],
      // 申请表单
      applyForm: {
        name: "",
        unit: "",
        college: "",
        email: "",
        identity: "",
        validity: [],
        imageList: [],
        db: [],
        check: false
      },
      /** 日期选择器快捷选项 */
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一年',
            onClick(picker) {
              const start = new Date();
              const end = new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三年',
            onClick(picker) {
              const start = new Date();
              const end = new Date(start.getTime() + 3 * 365 * 24 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '长期',
            onClick(picker) {
              const end = new Date('9999-12-31');
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      // 上传文件列表
      fileList: [],
      time: "",
      // 禁用申请按钮
      disabledApply_0: false,
      // 协议对话框
      agreementDialog1: false,
      agreementDialog2: false,
      // 提交申请加载中
      applyLoading: false,
      activeName: null,
      menuList: [
        {
          label: "账号设置",
          name: "0",
          icon: "el-icon-user",
          path: "/user_center/account"
        },
        {
          label: "我的购物车",
          name: "1",
          icon: "el-icon-shopping-cart-1",
          path: "/user_center/shopping"
        },
        {
          label: "订单与发票",
          name: "2",
          icon: "el-icon-notebook-2",
          path: "/user_center/orders"
        },
        {
          label: "会员及优惠券",
          name: "3",
          icon: "el-icon-s-ticket",
          path: "/user_center/vip_coupon"
        },
        {
          label: "我的收藏",
          name: "4",
          icon: "el-icon-star-off",
          path: "/user_center/collect"
        }
      ]
    };
  },
  methods: {
    // 获取登入用户信息
    getUserInfo(callback, type) {
      const _this = this;
      const fun = function() {
        _this.userInfo = _this.$store.getters.getUserInfo;
        if (!_this.userInfo.name || !_this.userInfo.token) {
          _this.$router.push("/");
          return;
        }
        if (
          _this.userInfo.type === "个人用户" &&
          _this.userInfo.status === "1"
        ) {
          let path = _this.$router.currentRoute.path;
          if (
            path === "/user_center/confirm_order" ||
            path === "/user_center/trade_result"
          )
            _this.activeName = "1";
          else {
            if (path === "/user_center/coupon" || path === "/user_center/vip")
              _this.activeName = "3";
            else
              _this.menuList.forEach(item => {
                if (item.path === path) _this.activeName = item.name;
              });
            if (!_this.activeName) _this.activeName = "0";
            if (_this.activeName === "3")
              _this.jumpRouter(_this.$router.currentRoute.fullPath);
            else
              _this.menuList.forEach(item => {
                if (_this.activeName === item.name) _this.jumpRouter(item.path);
              });
          }
        } else {
          _this.jumpRouter("/user_center");
        }
        _this.loading = false;
        if (callback) callback();
      };

      this.loading = true;
      this.$emit("getUserInfo", fun, type);
    },
    /**
     * 获取感兴趣的数据库
     */
    async getDbList() {
      try {
        const res = await this.$http.get('/api/user/getInterestDb')
        const { status, data } = res.data
        if (status === 0 && data && Array.isArray(data))
          this.dbList = data
      }
      catch(_) {}
    },
    jump(val) {
      const { path } = val.$attrs
      if (path)
        this.jumpRouter(path)
    },
    // 跳转路由
    jumpRouter(path) {
      this.$router.push(path);
    },
    // 移除图片
    handleRemove(file) {
      for (let i = 0; i < this.applyForm.imageList.length; i++) {
        if (this.applyForm.imageList[i].uid === file.uid) {
          this.applyForm.imageList.splice(i, 1);
          break;
        }
      }
    },
    // 图片上传成功
    handleSuccess(response, file) {
      // 上传失败，返回错误信息
      if (response.status !== 0) {
        if (!response.message) response.message = "服务器错误，请稍后再试！";
        this.$message.error("图片上传失败，" + response.message);
      }
      //上传成功，整理数据
      else {
        if (response.data.url)
          this.applyForm.imageList.push({
            url: response.data.url,
            uid: file.uid
          });
      }
    },
    // 图片上传失败
    handleError() {
      this.$message.error("图片上传失败，服务器错误，请稍后再试！");
    },
    // 图片超出个数限制
    handleExceed() {
      this.$message.error("最多只能上传8张图片!");
    },
    // 上传头像前的校验
    async beforeUpload(file) {
      this.time = new Date().getTime();
      const isJPG = file.type.indexOf("image/") >= 0;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) this.$message.error("只能上传图片文件！");
      else if (!isLt2M) this.$message.error("上传图片大小不能超过 2MB！");
      return new Promise((resolve, reject) => {
        if (isJPG && isLt2M) return resolve(true);
        else return reject(false);
      });
    },
    // 提交申请
    apply() {
      if (this.disabledApply || this.disabledApply_0) return;
      this.disabledApply_0 = true;
      setTimeout(() => {
        this.disabledApply_0 = false;
      }, 2000);
      // 判断邮箱是否符合校验规则
      const reg = /^[a-zA-Z0-9]+([-_.][A-Za-z0-9]*)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
      if (!reg.test(this.applyForm.email)) {
        this.$message.error("请输入正确的邮箱地址");
        return;
      }

      this.applyLoading = true;
      this.$http
        .post(process.env.API_ROOT + "/user/verifyInfo", this.applyForm, {
          headers: {
            token: this.userInfo.token
          }
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据message返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("申请认证失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            this.userInfo.status = res.data.status;
            this.userInfo.verifyName = res.data.verifyName;
            this.userInfo.departent = res.data.departent;
            this.userInfo.college = res.data.college;
            this.userInfo.email = res.data.email;
            this.userInfo.identity = res.data.identity;
            this.userInfo.validity = this.applyForm.validity;
            this.userInfo.updateTime = res.data.updateTime;
            this.$store.commit("setUserInfo", this.userInfo);
            this.$message.success("已成功提交认证申请！");
            this.getUserInfo();
            this.$forceUpdate();
          }
        })
        .catch(() => {
          this.$message.error("申请认证失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.applyLoading = false;
        });
    },
    // 撤销申请
    revocation(val) {
      this.$http
        .post(process.env.API_ROOT + "/user/revoke", null, {
          headers: {
            token: this.userInfo.token
          }
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据message返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            if (val === 0) this.$message.error("撤销认证失败，" + res.message);
            else this.$message.error("重新申请失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            this.userInfo.status = res.data.status;
            this.$store.commit("setUserInfo", this.userInfo);
            if (val === 0) this.$message.success("已成功撤销认证申请！");
            this.applyForm.imageList = [];
            this.$forceUpdate();
          }
        })
        .catch(() => {
          if (val === 0)
            this.$message.error("撤销认证失败，服务器错误，请稍后再试！");
          else this.$message.error("重新申请失败，服务器错误，请稍后再试！");
        });
    },
    // 改变活动页面
    changeActiveName(val) {
      this.activeName = val;
    },
    // IP登录
    IPLogin() {
      this.$emit("IPLogin");
    },
    /**
     * 校验有效期
     */
    checkValidity(val) {
      if (Array.isArray(val) && val[1]) {
        if (new Date(val[1]).getTime() <= new Date().getTime()) {
          this.$message.warning('有效期结束日期不得早于当前日期！')
          this.applyForm.validity = []
        }
      }
    }
  },
  beforeMount() {
    const userInfo = this.$store.getters.getUserInfo;
    if (!userInfo.name || !userInfo.token)
      return this.$router.push("/");
    this.activeName = this.menuList.find(
      item => item.path === this.$route.path
    ).name;
  },
  mounted() {
    this.getDbList();
    this.getUserInfo();
  },
  computed: {
    disabledApply() {
      const data = this.applyForm;
      return (
        !data.name ||
        !data.unit ||
        !data.college ||
        !data.email ||
        !data.identity ||
        !data.check ||
        !data.imageList ||
        !data.imageList.length ||
        !data.validity ||
        data.validity.length !== 2 ||
        (this.dbList && this.dbList.length && !data.db.length)
      )
    }
  }
};
</script>

<style lang="scss" scoped>
.user_center {
  width: 100%;
  height: 100%;
  position: relative;

  .card {
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

    > .el-card {
      width: 400px;
      height: 100%;
      margin: auto;
      border-radius: 15px;

      .card_header {
        font-size: 20px;
        font-weight: 700;
        color: #0068b7;
      }

      .el-card__body {
        box-sizing: border-box;

        .card_body {
          height: 100%;
        }
      }
    }
  }

  .database {
    width: 100%;
    height: 100%;
    max-height: 1080px;
    background-image: url(~@/assets/bg/user-center.jpg);
    background-size: cover;
    color: white;
    position: relative;

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0;

      > div {
        text-align: center;
        margin: 30px 0;

        > span {
          font-size: 30px;
        }
      }
    }

    .footer {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 23px;
    }
  }

  .white_button {
    width: 100%;
    margin-top: 5px;
    background: white;
    color: #0e68b4;
    border-radius: 12px;
    border: 1px solid #0e68b4;
  }

  .blue_button {
    width: 100%;
    margin-top: 10px;
    background: #0e68b4;
    color: white;
    border-radius: 12px;
    border: 1px solid #0e68b4;
  }

  /* 被禁用按钮 */
  .blue_button.el-button.is-disabled,
  .blue_button.el-button.is-disabled:focus {
    background: #5097cb;
    color: white;
    border: 1px solid #5097cb;
  }

  .red_button {
    width: 100%;
    margin-top: 5px;
    background: white;
    color: red;
    border-radius: 12px;
    border: 1px solid red;
  }
}
</style>

<style lang="scss">
.user_center {
  .card {
    > .el-card {
      position: relative;

      .el-card__header {
        height: 62px;
      }

      .el-card__body {
        position: absolute;
        top: 63px;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }

  .apply_card {
    .card_body {
      .el-form {
        .el-form-item {
          margin-bottom: 10px;

          .el-form-item__label {
            padding: 0;
          }

          .el-form-item__content {
            .upload {
              .el-upload {
                width: 100%;
              }

              .el-upload__tip {
                margin: 0;
                color: #9e9e9e;
                line-height: 20px;
              }
            }
          }
        }
      }

      .check {
        max-width: 100%;
        padding: 0 10px;
        position: relative;
        box-sizing: border-box;

        .el-checkbox__input {
          transform: scale(1.5) translate(0, -50%);
        }

        .el-checkbox__label {
          max-width: 320px;
          padding-left: 15px;

          p {
            color: black;
            line-height: 1.8;

            .agreement {
              padding: 3px;
              color: #0e68b4;
            }

            .agreement:hover {
              background: #dddddd;
              border-radius: 5px;
            }
          }
        }
      }
    }
  }

  .reject_card {
    .reason {
      height: 200px;
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
      background: #eeeeee;
      border-radius: 10px;
      margin-bottom: 15px;
    }
  }

  .el-dialog__wrapper {
    padding: 80px 0;
  }

  .agreementDialog {
    height: 100%;
    min-height: 600px;
    margin: 0 auto;
    border-radius: 10px;

    .el-icon-close:before {
      font-size: 30px;
      font-weight: 700;
      color: #222222;
    }

    .el-dialog__header {
      height: 0;
      padding: 0;
    }

    .el-dialog__body {
      height: 100%;
      padding: 0;
      box-sizing: border-box;
      color: black;
    }
  }

  .load {
    z-index: 2;
    width: 300px;
    height: 200px;
    border-radius: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .el-loading-spinner {
      transform: scale(1.2);
    }
  }

  .pass_card {
    width: 100%;
    height: 100%;

    .tabs {
      height: 100%;
      border: none;
      background: transparent;

      > .el-tabs__header {
        padding: 100px 20px;
        background: #fbfaff;
        box-sizing: border-box;
        margin: 0;

        .el-tabs__item {
          width: 200px;
          border: none;
          text-align: left;
          font-size: 16px;
          font-weight: 700;
          color: #576388;
          margin: 0 0 20px;
          border-radius: 10px;

          > div {
            display: flex;
            align-items: center;

            .icon {
              font-size: 20px;
              margin: 0 8px 2px;
              font-weight: 700;
            }

            .el-badge.vip-tab {
              .el-badge__content {
                top: 0;
                padding: 2px 4px;
                line-height: 18px;
              }
            }
          }
        }

        .el-tabs__item:hover {
          color: #0168b7;
        }

        .el-tabs__item.is-active {
          background: #0168b7;
          color: white;
        }
      }

      > .el-tabs__content {
        padding: 10px;
        height: 100%;
        box-sizing: border-box;

        > .el-tab-pane {
          height: 100%;

          .tabs_body {
            height: 100%;
            background: transparent;
          }
        }
      }
    }

    .tabs.shopping_tab {
      > .el-tabs__content {
        padding: 0;
      }
    }
  }
}
</style>

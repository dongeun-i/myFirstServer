<template>
	<v-card class="col-12 elevation-0 bg-gray">
		<v-sheet class="d-flex bg-gray justify-space-between align-center">
			<v-card-title class="font-weight-bold">상품등록</v-card-title>
			<v-btn @click="postProductInfo">제출</v-btn>
		</v-sheet>
		<ExpansionPanels :panels="panels"/>
	</v-card>
</template>
<script>
import ExpansionPanels from '@/components/Expansion-panels-form.vue'
import FileUploader from '@/mixins/FileUploader.js'
import Payload from '@/mixins/Payload.js'
export default {
	layout:'layout',
	mixins:[FileUploader,Payload],
	components:{
		ExpansionPanels
	},
	data(){
		return{
			category:null,
			panels:[{
				title:'상품명',
				model:null,
				layout:'input',
				target:'name'
			},{
				title:"상품 이미지",
				model:null,
				layout:'img',
				target:'thumbnail'
			},{
				title:'카테고리',
				layout:'select',
				values:null,
				model:'선택',
				target:'categoryId',
			},{
				title:'판매가',
				layout:'input',
				model:null,
				target:'price'
			},{
				title:'할인금액',
				layout:'input',
				model:null,
				target:'discount'	
			},{
				title:'상태',
				layout:'select',
				model:'선택',
				target:'status',
				values:[{
					label:'선택'
				},{
					label:'판매중'
				},{
					label:'품절'
				},{
					label:'비공개'
				},{
					label:'판매중지'
				},]	
			}
			],
			editItems:[{
				target:'name',
				value:null
			},{
				target:'thumbnail',
				value:null
			},{
				target:'categoryId',
				value:null
			},{
				
			}]
		}
	},
	async asyncData({$axios}){
		let responseData = {};
		responseData = await $axios.$get('/api/category/list');
		return{
			categoryInfo : responseData
		}
	},
	created(){
		console.log('크리')
		this.panels.map(p=>{
			if(p.title == '카테고리'){
				this.categoryInfo.unshift({'label':'선택'});
				return p.values = this.categoryInfo;
			}
		})
	},
	methods:{
		async postProductInfo(){
			// 검사를해서 빈데이터가없으면 통과
			let panels = this.panels
			if(!this.checkmodels(panels)){
				let productInfo = this.makeFormData(this.panels);
				// 상품등록 호출
				try {
					const responseData = await this.$axios({
						method:'post',
						url:'/api/product/register',
						data:productInfo,
						headers: {
							'Content-Type': 'multipart/form-data',
						}
					})
					if(responseData){
						alert('상품등록이 완료되었습니다.')
						return this.$router.push('/product/list');
					}
				} catch (error) {
					// 등록 실패했을 경우 끝 !
					return alert('상품등록이 실패하였습니다.');
				}
			}
		},
	}
}
</script>
<style scoped>
	.bg-gray{
		background-color: #ccc ;
	}
</style>
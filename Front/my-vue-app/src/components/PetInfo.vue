<template>
    <div class="pet-info-container">
        <h2>펫 정보</h2>
        <form @submit.prevent="addPet">
            <div>
                <label for="petName">이름</label>
                <input v-model="newPet.name" type="text" placeholder="이름을 입력해주세요" required>
            </div>
            <div>
                <label for="petGender">성별</label>
                <select v-model="newPet.gender" required>
                    <option value="남자">남자</option>
                    <option value="여자">여자</option>
                </select>
            </div>
            <div>
                <label for="petBirthdate">생년월일</label>
                <input v-model="newPet.birthdate" type="date" placeholder="YYYY-MM-DD" required>
            </div>
            <div>
                <label for="petBreed">견종</label>
                <input v-model="newPet.breed" type="text" placeholder="견종을 입력해 주세요" required>
            </div>
            <div>
                <label for="petIntro">소개글</label>
                <textarea v-model="newPet.intro" placeholder="소개글을 작성해 주세요"></textarea>
            </div>
            <button type="submit">펫 추가</button>
        </form>

        <ul v-if="pets.length > 0">
            <li v-for="pet in pets" :key="pet.pet_id">
                <p>{{ pet.name }} ({{ pet.breed }})</p>
                <button @click="deletePet(pet.pet_id)">삭제</button>
            </li>
        </ul>
        <p v-else>등록된 반려동물이 없습니다.</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            pets: [],
            newPet: {
                name: '',
                gender: '',
                birthdate: '',
                breed: '',
                intro: '',
            }
        };
    },
    methods: {
        async fetchPets() {
            try {
                const res = await axios.get('/api/mypets');
                this.pets = res.data.pets;
            } catch (err) {
                console.error("펫 정보 로딩 중 오류 발생:", err);
            }
        },
        async addPet() {
            try {
                await axios.post('/api/mypets/add', this.newPet);
                this.fetchPets(); // 펫 정보 다시 로드
                alert('펫이 성공적으로 추가되었습니다.');
            } catch (err) {
                console.error("펫 추가 중 오류 발생:", err);
            }
        },
        async deletePet(petId) {
            try {
                if (confirm("정말로 이 펫을 삭제하시겠습니까?")) {
                    await axios.post(`/api/mypets/delete/${petId}`);
                    this.fetchPets(); // 펫 정보 다시 로드
                    alert('펫이 성공적으로 삭제되었습니다.');
                }
            } catch (err) {
                console.error("펫 삭제 중 오류 발생:", err);
            }
        }
    },
    created() {
        this.fetchPets(); // 컴포넌트 생성 시 펫 정보 로드
    }
}
</script>

<style>
.pet-info-container {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

form div {
    margin-bottom: 16px;
}

form label {
    display: block;
    font-weight: bold;
}

form input, form select, form textarea {
    width: 100%;
    padding: 8px;
    margin-top: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    padding: 8px 16px;
    border: none;
    background-color: #007BFF;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

ul {
    list-style-type: none;
    padding: 0;
}

ul li {
    margin-bottom: 12px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 12px;
}
</style>

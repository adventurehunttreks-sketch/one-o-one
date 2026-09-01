// Admin Panel Functionality
const AdminPanel = {
    password: localStorage.getItem('adminPass') || 'admin123',
    isLoggedIn: false,
    clickCount: 0,
    clickTimer: null,

    init() {
        this.bindEvents();
        this.loadSavedContent();
        this.loadGalleryImages();
        this.loadTeamMembers();
        this.loadCourses();
        this.loadSales();
        this.loadContacts();
    },

    bindEvents() {
        // Hidden trigger - click copyright 5 times
        const trigger = document.getElementById('adminTrigger');
        if (trigger) {
            trigger.addEventListener('click', () => this.handleTriggerClick());
        }

        // Close button
        document.getElementById('adminClose')?.addEventListener('click', () => this.closeAdmin());

        // Login button
        document.getElementById('loginBtn')?.addEventListener('click', () => this.login());

        // Tab switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Save content
        document.getElementById('saveContent')?.addEventListener('click', () => this.saveContent());

        // Team management
        document.getElementById('addTeamMember')?.addEventListener('click', () => this.addTeamMember());
        document.getElementById('saveTeam')?.addEventListener('click', () => this.saveTeam());

        // Course management
        document.getElementById('saveCourses')?.addEventListener('click', () => this.saveCourses());

        // Sales management
        document.getElementById('saveSales')?.addEventListener('click', () => this.saveSales());

        // Contacts management
        document.getElementById('clearContacts')?.addEventListener('click', () => this.clearContacts());

        // Add image
        document.getElementById('addImage')?.addEventListener('click', () => this.addImage());

        // Save images
        document.getElementById('saveImages')?.addEventListener('click', () => this.saveImages());

        // Change password
        document.getElementById('changePassword')?.addEventListener('click', () => this.changePassword());

        // Reset all
        document.getElementById('resetAll')?.addEventListener('click', () => this.resetAll());

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // Enter key for login
        document.getElementById('adminPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
    },

    handleTriggerClick() {
        this.clickCount++;
        clearTimeout(this.clickTimer);
        
        this.clickTimer = setTimeout(() => {
            this.clickCount = 0;
        }, 2000);

        if (this.clickCount >= 5) {
            this.openAdmin();
            this.clickCount = 0;
        }
    },

    openAdmin() {
        document.getElementById('adminOverlay').classList.add('active');
        if (this.isLoggedIn) {
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            this.loadContentFields();
        }
    },

    closeAdmin() {
        document.getElementById('adminOverlay').classList.remove('active');
    },

    login() {
        const password = document.getElementById('adminPassword').value;
        if (password === this.password) {
            this.isLoggedIn = true;
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            this.loadContentFields();
            this.loadGalleryImages();
        } else {
            alert('Incorrect password!');
        }
    },

    logout() {
        this.isLoggedIn = false;
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('adminPassword').value = '';
    },

    switchTab(tabName) {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    },

    loadContentFields() {
        const content = JSON.parse(localStorage.getItem('siteContent') || '{}');
        
        document.getElementById('editHeroTitle').value = content.heroTitle || document.querySelector('.hero-content h1')?.textContent || '';
        document.getElementById('editHeroSubtitle').value = content.heroSubtitle || document.querySelector('.hero-content p')?.textContent || '';
        document.getElementById('editAboutTitle').value = content.aboutTitle || document.querySelector('.about-text h3')?.textContent || '';
        document.getElementById('editAboutText').value = content.aboutText || document.querySelector('.about-text p')?.textContent || '';
        document.getElementById('editPhone').value = content.phone || '9851316494';
        document.getElementById('editEmail').value = content.email || 'info@101coffee.com.np';
        document.getElementById('editYear').value = content.year || '2019';
        document.getElementById('editStudents').value = content.students || '7,000+';
    },

    saveContent() {
        const content = {
            heroTitle: document.getElementById('editHeroTitle').value,
            heroSubtitle: document.getElementById('editHeroSubtitle').value,
            aboutTitle: document.getElementById('editAboutTitle').value,
            aboutText: document.getElementById('editAboutText').value,
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value,
            year: document.getElementById('editYear').value,
            students: document.getElementById('editStudents').value
        };

        localStorage.setItem('siteContent', JSON.stringify(content));
        this.applyContent(content);
        alert('Content saved successfully!');
    },

    applyContent(content) {
        if (content.heroTitle) {
            const heroTitle = document.querySelector('.hero-content h1');
            if (heroTitle) heroTitle.textContent = content.heroTitle;
        }
        if (content.heroSubtitle) {
            const heroSubtitle = document.querySelector('.hero-content p');
            if (heroSubtitle) heroSubtitle.textContent = content.heroSubtitle;
        }
        if (content.aboutTitle) {
            const aboutTitle = document.querySelector('.about-text h3');
            if (aboutTitle) aboutTitle.textContent = content.aboutTitle;
        }
        if (content.aboutText) {
            const aboutText = document.querySelector('.about-text p');
            if (aboutText) aboutText.textContent = content.aboutText;
        }
        if (content.phone) {
            document.querySelectorAll('.info-item p').forEach(p => {
                if (p.textContent.includes('9851316494')) {
                    p.innerHTML = p.innerHTML.replace(/9851316494/, content.phone.split('<br>')[0] || content.phone);
                }
            });
        }
        if (content.year) {
            const yearEl = document.querySelector('.stat-number');
            if (yearEl && yearEl.textContent.match(/^\d{4}$/)) {
                yearEl.textContent = content.year;
            }
        }
        if (content.students) {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(s => {
                if (s.textContent.includes('7,000')) {
                    s.textContent = content.students;
                }
            });
        }
    },

    loadSavedContent() {
        const content = JSON.parse(localStorage.getItem('siteContent') || '{}');
        if (Object.keys(content).length > 0) {
            this.applyContent(content);
        }
    },

    loadGalleryImages() {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        const imageList = document.getElementById('imageList');
        if (!imageList) return;

        imageList.innerHTML = '';
        
        // Load default images if no custom images saved
        const defaultImages = this.getDefaultImages();
        const allImages = images.length > 0 ? images : defaultImages;

        allImages.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'image-item';
            div.innerHTML = `
                <img src="${img.src}" alt="${img.alt}">
                <button class="image-delete" data-index="${index}">&times;</button>
            `;
            imageList.appendChild(div);
        });

        // Bind delete buttons
        document.querySelectorAll('.image-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                this.deleteImage(idx);
            });
        });
    },

    getDefaultImages() {
        return [
            { src: 'espresso extraction.jpg', alt: 'Espresso Extraction', category: 'training' },
            { src: 'latte.jpg', alt: 'Latte Art', category: 'coffee' },
            { src: 'art.jpg', alt: 'Coffee Art', category: 'training' },
            { src: 'drinks.jpg', alt: 'Coffee Drinks', category: 'coffee' },
            { src: 'serving.jpg', alt: 'Coffee Serving', category: 'training' },
            { src: 'certificate distribution.jpg', alt: 'Certificate Distribution', category: 'events' },
            { src: 'prize.jpg', alt: 'Prize Distribution', category: 'events' },
            { src: 'farewellcake.jpg', alt: 'Farewell Celebration', category: 'events' },
            { src: 'machine.jpg', alt: 'Coffee Machine Training', category: 'training' },
            { src: 'temping.jpg', alt: 'Temping Practice', category: 'training' },
            { src: 'blue lagoon.jpg', alt: 'Blue Lagoon Drink', category: 'coffee' },
            { src: 'photos2.jpg', alt: 'Training Session', category: 'training' },
            { src: 'photos3.jpg', alt: 'Indoor Training', category: 'training' },
            { src: 'photos5.jpg', alt: 'Outdoor Training', category: 'training' },
            { src: 'photos6.jpg', alt: 'Student Achievement', category: 'events' },
            { src: 'photos7.jpg', alt: 'Barista Practice', category: 'training' },
            { src: 'photos8.jpg', alt: 'Coffee Art Work', category: 'coffee' },
            { src: 'photos9.jpg', alt: 'Coffee Event', category: 'events' },
            { src: 'photos50.jpg', alt: 'Training Workshop', category: 'training' },
            { src: 'photos100.jpg', alt: 'Graduation Day', category: 'events' }
        ];
    },

    addImage() {
        const fileInput = document.getElementById('newImage');
        const category = document.getElementById('imageCategory').value;
        
        if (!fileInput.files.length) {
            alert('Please select an image file');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            
            if (images.length === 0) {
                // Initialize with defaults first
                localStorage.setItem('galleryImages', JSON.stringify(this.getDefaultImages()));
            }
            
            const allImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            allImages.push({
                src: e.target.result,
                alt: file.name.replace(/\.[^/.]+$/, ''),
                category: category
            });
            
            localStorage.setItem('galleryImages', JSON.stringify(allImages));
            this.loadGalleryImages();
            fileInput.value = '';
            alert('Image added! Click "Save Changes" to update the gallery.');
        };
        
        reader.readAsDataURL(file);
    },

    deleteImage(index) {
        if (!confirm('Are you sure you want to delete this image?')) return;
        
        let images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        if (images.length === 0) {
            images = this.getDefaultImages();
        }
        
        images.splice(index, 1);
        localStorage.setItem('galleryImages', JSON.stringify(images));
        this.loadGalleryImages();
    },

    saveImages() {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        this.updateGalleryOnPage(images);
        alert('Gallery updated successfully!');
    },

    updateGalleryOnPage(images) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';
        
        images.forEach(img => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.dataset.category = img.category;
            div.innerHTML = `
                <img src="${img.src}" alt="${img.alt}">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            `;
            galleryGrid.appendChild(div);
        });

        // Rebind lightbox
        if (typeof window.rebindLightbox === 'function') {
            window.rebindLightbox();
        }
    },

    // Team Management Functions
    loadTeamMembers() {
        const team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
        const teamList = document.getElementById('teamList');
        if (!teamList) return;

        teamList.innerHTML = '';
        
        // Load default team if no custom team saved
        const defaultTeam = this.getDefaultTeam();
        const allTeam = team.length > 0 ? team : defaultTeam;

        allTeam.forEach((member, index) => {
            const div = document.createElement('div');
            div.className = 'team-list-item';
            div.innerHTML = `
                <img src="${member.photo || 'photos1.jpg'}" alt="${member.name}">
                <div class="team-list-info">
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                </div>
                <button class="team-list-edit" data-index="${index}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="team-list-delete" data-index="${index}" title="Delete">&times;</button>
            `;
            teamList.appendChild(div);
        });

        // Bind edit buttons
        document.querySelectorAll('.team-list-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                this.editTeamMember(idx);
            });
        });

        // Bind delete buttons
        document.querySelectorAll('.team-list-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                this.deleteTeamMember(idx);
            });
        });
    },

    getDefaultTeam() {
        return [
            { name: 'Founder', role: 'Founder & CEO', desc: 'Passionate about coffee education.', photo: 'photos1.jpg', facebook: '', instagram: '' },
            { name: 'Head Barista', role: 'Head Barista & Trainer', desc: 'Award-winning barista.', photo: 'photos2.jpg', facebook: '', instagram: '' },
            { name: 'Training Manager', role: 'Training Manager', desc: 'Dedicated to training programs.', photo: 'photos3.jpg', facebook: '', instagram: '' },
            { name: 'Coffee Expert', role: 'Coffee Quality Expert', desc: 'Specialist in coffee sourcing.', photo: 'photos5.jpg', facebook: '', instagram: '' }
        ];
    },

    addTeamMember() {
        const addBtn = document.getElementById('addTeamMember');
        
        // Check if we're in edit mode
        if (addBtn.classList.contains('editing')) {
            this.updateTeamMember(parseInt(addBtn.dataset.editIndex));
            return;
        }

        const name = document.getElementById('teamName').value.trim();
        const role = document.getElementById('teamRole').value.trim();
        const desc = document.getElementById('teamDesc').value.trim();
        const facebook = document.getElementById('teamFacebook').value.trim();
        const instagram = document.getElementById('teamInstagram').value.trim();
        const photoInput = document.getElementById('teamPhoto');

        if (!name || !role) {
            alert('Please enter name and role!');
            return;
        }

        const saveMember = (photoData) => {
            const team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
            if (team.length === 0) {
                localStorage.setItem('teamMembers', JSON.stringify(this.getDefaultTeam()));
            }
            
            const allTeam = JSON.parse(localStorage.getItem('teamMembers') || '[]');
            allTeam.push({
                name: name,
                role: role,
                desc: desc,
                photo: photoData || 'photos1.jpg',
                facebook: facebook,
                instagram: instagram
            });
            
            localStorage.setItem('teamMembers', JSON.stringify(allTeam));
            this.loadTeamMembers();
            
            // Clear form
            document.getElementById('teamName').value = '';
            document.getElementById('teamRole').value = '';
            document.getElementById('teamDesc').value = '';
            document.getElementById('teamFacebook').value = '';
            document.getElementById('teamInstagram').value = '';
            photoInput.value = '';
            
            alert('Team member added! Click "Save Team Changes" to update the website.');
        };

        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => saveMember(e.target.result);
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveMember(null);
        }
    },

    deleteTeamMember(index) {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        
        let team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
        if (team.length === 0) {
            team = this.getDefaultTeam();
        }
        
        team.splice(index, 1);
        localStorage.setItem('teamMembers', JSON.stringify(team));
        this.loadTeamMembers();
    },

    editTeamMember(index) {
        let team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
        if (team.length === 0) {
            team = this.getDefaultTeam();
        }

        const member = team[index];
        if (!member) return;

        // Fill the form with member data
        document.getElementById('teamName').value = member.name || '';
        document.getElementById('teamRole').value = member.role || '';
        document.getElementById('teamDesc').value = member.desc || '';
        document.getElementById('teamFacebook').value = member.facebook || '';
        document.getElementById('teamInstagram').value = member.instagram || '';

        // Change add button to update button
        const addBtn = document.getElementById('addTeamMember');
        addBtn.textContent = 'Update Member';
        addBtn.dataset.editIndex = index;
        addBtn.classList.add('editing');

        // Scroll to form
        document.querySelector('#tab-team .admin-section').scrollIntoView({ behavior: 'smooth' });
    },

    updateTeamMember(index) {
        const name = document.getElementById('teamName').value.trim();
        const role = document.getElementById('teamRole').value.trim();
        const desc = document.getElementById('teamDesc').value.trim();
        const facebook = document.getElementById('teamFacebook').value.trim();
        const instagram = document.getElementById('teamInstagram').value.trim();
        const photoInput = document.getElementById('teamPhoto');

        if (!name || !role) {
            alert('Please enter name and role!');
            return;
        }

        let team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
        if (team.length === 0) {
            team = this.getDefaultTeam();
        }

        const saveUpdate = (photoData) => {
            team[index] = {
                name: name,
                role: role,
                desc: desc,
                photo: photoData || team[index].photo || 'photos1.jpg',
                facebook: facebook,
                instagram: instagram
            };

            localStorage.setItem('teamMembers', JSON.stringify(team));
            this.loadTeamMembers();
            this.resetTeamForm();
            alert('Team member updated! Click "Save Team Changes" to update the website.');
        };

        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => saveUpdate(e.target.result);
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveUpdate(null);
        }
    },

    resetTeamForm() {
        document.getElementById('teamName').value = '';
        document.getElementById('teamRole').value = '';
        document.getElementById('teamDesc').value = '';
        document.getElementById('teamFacebook').value = '';
        document.getElementById('teamInstagram').value = '';
        document.getElementById('teamPhoto').value = '';

        const addBtn = document.getElementById('addTeamMember');
        addBtn.textContent = 'Add Member';
        delete addBtn.dataset.editIndex;
        addBtn.classList.remove('editing');
    },

    saveTeam() {
        const team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
        this.updateTeamOnPage(team);
        alert('Team section updated successfully!');
    },

    updateTeamOnPage(team) {
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;

        teamGrid.innerHTML = '';
        
        team.forEach(member => {
            const div = document.createElement('div');
            div.className = 'team-card';
            div.innerHTML = `
                <div class="team-img">
                    <img src="${member.photo || 'photos1.jpg'}" alt="${member.name}">
                    <div class="team-social">
                        ${member.facebook ? `<a href="${member.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                        ${member.instagram ? `<a href="${member.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                    </div>
                </div>
                <h3>${member.name}</h3>
                <p class="team-role">${member.role}</p>
            `;
            teamGrid.appendChild(div);
        });
    },

    // Course Management Functions
    getDefaultCourses() {
        return [
            {
                id: 1,
                name: 'One Day Coffee & Drink Demo Class',
                desc: 'Learn about coffee culture, history, health benefits, business, and basic latte art. Anyone can join!',
                duration: '1 Hour',
                price: 'FREE OFFER',
                isFree: true,
                features: ['Coffee Culture & History', 'Health Benefits', 'Basic Latte Art']
            },
            {
                id: 2,
                name: '10 Days Basic to Advance Training',
                desc: 'Perfect for skill certification and introducing yourself to the global coffee market.',
                duration: '2 Hours/Day',
                price: 'NPR 10,000',
                isFree: false,
                features: ['20 Credit Hours', 'Skill Certification', 'Global Coffee Market']
            },
            {
                id: 3,
                name: '30 Days Advance Training',
                desc: 'Hands-on training in a well-equipped coffee workshop with internship at our outlet.',
                duration: '2 Hours/Day',
                price: 'NPR 15,000',
                isFree: false,
                features: ['40 Credit Hours', '30 Hours Internship', 'Professional Certificate']
            },
            {
                id: 4,
                name: 'Personal Coaching Class',
                desc: 'Personalized training for individuals with time-management difficulties or flexible schedule needs.',
                duration: 'Flexible',
                price: 'As Required',
                isFree: false,
                features: ['1-on-1 Training', 'Flexible Schedule', 'Customized Learning']
            }
        ];
    },

    loadCourses() {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const courseList = document.getElementById('adminCourseList');
        if (!courseList) return;

        const allCourses = courses.length > 0 ? courses : this.getDefaultCourses();
        
        courseList.innerHTML = '';
        allCourses.forEach((course, index) => {
            const div = document.createElement('div');
            div.className = 'admin-course-item';
            div.innerHTML = `
                <h4>Course ${index + 1}</h4>
                <label>Course Name</label>
                <input type="text" class="course-name" data-index="${index}" value="${course.name}">
                <label>Description</label>
                <textarea class="course-desc" data-index="${index}">${course.desc}</label>
                <label>Duration</label>
                <input type="text" class="course-duration" data-index="${index}" value="${course.duration}">
                <label>Price</label>
                <input type="text" class="course-price-input" data-index="${index}" value="${course.price}">
                <label>Features (comma separated)</label>
                <input type="text" class="course-features-input" data-index="${index}" value="${course.features.join(', ')}">
            `;
            courseList.appendChild(div);
        });
    },

    saveCourses() {
        const courses = [];
        const items = document.querySelectorAll('.admin-course-item');
        
        items.forEach((item, index) => {
            courses.push({
                id: index + 1,
                name: item.querySelector('.course-name').value,
                desc: item.querySelector('.course-desc').value,
                duration: item.querySelector('.course-duration').value,
                price: item.querySelector('.course-price-input').value,
                isFree: item.querySelector('.course-price-input').value.toLowerCase().includes('free'),
                features: item.querySelector('.course-features-input').value.split(',').map(f => f.trim()).filter(f => f)
            });
        });

        localStorage.setItem('courses', JSON.stringify(courses));
        this.updateCoursesOnPage(courses);
        alert('Courses updated successfully!');
    },

    updateCoursesOnPage(courses) {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;

        coursesGrid.innerHTML = '';
        
        courses.forEach((course, index) => {
            const isFeatured = index === 2;
            const div = document.createElement('div');
            div.className = `course-card ${isFeatured ? 'featured' : ''}`;
            div.dataset.course = course.id;
            div.innerHTML = `
                ${isFeatured ? '<div class="course-badge">Most Popular</div>' : ''}
                ${course.isFree ? '<div class="course-badge free">FREE</div>' : ''}
                <div class="course-icon">
                    <i class="fas ${course.isFree ? 'fa-coffee' : index === 1 ? 'fa-fire' : index === 2 ? 'fa-award' : 'fa-user'}"></i>
                </div>
                <h3>${course.name}</h3>
                <p>${course.desc}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span class="course-price ${course.isFree ? 'free-price' : ''}">${course.price}</span>
                </div>
                <ul class="course-features">
                    ${course.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
                <a href="#contact" class="btn btn-primary">${course.isFree ? 'Join Free Class' : 'Enroll Now'}</a>
            `;
            coursesGrid.appendChild(div);
        });
    },

    // Sales Management Functions
    getDefaultSales() {
        return [
            {
                id: 1,
                name: 'Machine & Equipment',
                icon: 'fa-cog',
                desc: 'Professional espresso machines, grinders, brewers, and barista tools from top international brands. We supply equipment for cafes, restaurants, and home baristas.',
                features: ['Espresso Machines', 'Coffee Grinders', 'Brewing Equipment', 'Barista Tools & Accessories'],
                btnText: 'Get Quote',
                isFeatured: false
            },
            {
                id: 2,
                name: 'Roasted Beans',
                icon: 'fa-seedling',
                desc: 'Premium quality roasted coffee beans sourced from Nepal\'s finest coffee farms. Available in various roast levels and flavor profiles to suit every palate.',
                features: ['Light Roast', 'Medium Roast', 'Dark Roast', 'Custom Blends'],
                btnText: 'Order Now',
                isFeatured: true
            },
            {
                id: 3,
                name: 'Consultant Services',
                icon: 'fa-headset',
                desc: 'Expert consulting for cafe setup, menu development, equipment selection, and coffee business planning. Let our experts help you build your dream coffee business.',
                features: ['Cafe Setup & Design', 'Menu Development', 'Equipment Selection', 'Business Planning'],
                btnText: 'Contact Us',
                isFeatured: false
            }
        ];
    },

    loadSales() {
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        const salesList = document.getElementById('adminSalesList');
        if (!salesList) return;

        const allSales = sales.length > 0 ? sales : this.getDefaultSales();
        
        salesList.innerHTML = '';
        allSales.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'admin-course-item';
            div.innerHTML = `
                <h4>Sales Item ${index + 1}</h4>
                <label>Item Name</label>
                <input type="text" class="sales-name" data-index="${index}" value="${item.name}">
                <label>Description</label>
                <textarea class="sales-desc" data-index="${index}">${item.desc}</textarea>
                <label>Button Text</label>
                <input type="text" class="sales-btn" data-index="${index}" value="${item.btnText}">
                <label>Features (comma separated)</label>
                <input type="text" class="sales-features-input" data-index="${index}" value="${item.features.join(', ')}">
            `;
            salesList.appendChild(div);
        });
    },

    saveSales() {
        const sales = [];
        const items = document.querySelectorAll('#adminSalesList .admin-course-item');
        
        items.forEach((item, index) => {
            const defaults = this.getDefaultSales();
            sales.push({
                id: index + 1,
                name: item.querySelector('.sales-name').value,
                icon: defaults[index]?.icon || 'fa-tag',
                desc: item.querySelector('.sales-desc').value,
                features: item.querySelector('.sales-features-input').value.split(',').map(f => f.trim()).filter(f => f),
                btnText: item.querySelector('.sales-btn').value,
                isFeatured: index === 1
            });
        });

        localStorage.setItem('sales', JSON.stringify(sales));
        this.updateSalesOnPage(sales);
        alert('Sales section updated successfully!');
    },

    updateSalesOnPage(sales) {
        const salesGrid = document.getElementById('salesGrid');
        if (!salesGrid) return;

        salesGrid.innerHTML = '';
        
        sales.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `sales-card ${item.isFeatured ? 'featured' : ''}`;
            div.innerHTML = `
                ${item.isFeatured ? '<div class="sales-badge">Best Seller</div>' : ''}
                <div class="sales-icon"><i class="fas ${item.icon}"></i></div>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <ul class="sales-features">
                    ${item.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
                <a href="#contact" class="btn btn-primary">${item.btnText}</a>
            `;
            salesGrid.appendChild(div);
        });
    },

    // Contact Management Functions
    loadContacts() {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        const contactList = document.getElementById('contactList');
        if (!contactList) return;

        if (submissions.length === 0) {
            contactList.innerHTML = '<p style="text-align: center; color: #888; padding: 40px;">No contact submissions yet.</p>';
            return;
        }

        contactList.innerHTML = '';
        submissions.forEach((sub, index) => {
            const date = new Date(sub.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const div = document.createElement('div');
            div.className = 'admin-contact-item';
            div.style.cssText = 'background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #6CB4EE;';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="font-size: 16px; color: #333;">${sub.name}</strong>
                    <span style="color: #888; font-size: 12px;">${formattedDate}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                    <p style="margin: 0; color: #666;"><i class="fas fa-envelope" style="width: 20px; color: #6CB4EE;"></i> ${sub.email}</p>
                    <p style="margin: 0; color: #666;"><i class="fas fa-phone" style="width: 20px; color: #6CB4EE;"></i> ${sub.phone}</p>
                </div>
                <p style="margin: 0 0 8px 0; color: #666;"><i class="fas fa-tag" style="width: 20px; color: #6CB4EE;"></i> <strong>Subject:</strong> ${sub.subject}</p>
                <p style="margin: 0; color: #555; background: #fff; padding: 12px; border-radius: 8px;"><i class="fas fa-comment" style="width: 20px; color: #6CB4EE;"></i> ${sub.message}</p>
            `;
            contactList.appendChild(div);
        });
    },

    clearContacts() {
        if (!confirm('Are you sure you want to clear all contact submissions?')) return;
        localStorage.removeItem('contactSubmissions');
        this.loadContacts();
        alert('All contact submissions have been cleared.');
    },

    changePassword() {
        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (current !== this.password) {
            alert('Current password is incorrect!');
            return;
        }

        if (newPass !== confirm) {
            alert('New passwords do not match!');
            return;
        }

        if (newPass.length < 4) {
            alert('Password must be at least 4 characters!');
            return;
        }

        this.password = newPass;
        localStorage.setItem('adminPass', newPass);
        
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        alert('Password changed successfully!');
    },

    resetAll() {
        if (!confirm('Are you sure? This will reset all changes to default.')) return;
        
        localStorage.removeItem('siteContent');
        localStorage.removeItem('galleryImages');
        localStorage.removeItem('teamMembers');
        localStorage.removeItem('courses');
        localStorage.removeItem('sales');
        localStorage.removeItem('adminPass');
        
        this.password = 'admin123';
        alert('All changes have been reset. Refreshing page...');
        location.reload();
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});

// Expose for gallery rebind
window.rebindLightbox = function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && typeof openLightbox === 'function') {
                openLightbox(img.src);
            }
        });
    });
};

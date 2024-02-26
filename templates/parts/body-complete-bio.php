<form id="js_form_bio_edit" class="doctor-dashboard__bio" enctype="multipart/form-data">

    <div class="doctor-dashboard__bio-edit">

        <!-- Public Profile Header -->
        <div class="doctor-dashboard__bio-edit-group group-networks group-networks-header">

            <h3 class="doctor-dashboard__bio-edit-group-title">Public Profile</h3>

        </div>

        <!-- Group -->
        <div class="doctor-dashboard__bio-edit-group group-profile d-flex">

            <input type="hidden" name="user_id" id="user_id" value="<?php echo get_user_blog_data()['profile']->ID; ?>">

            <input type="hidden" name="user_control" id="user_control" value="">

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub form-group">

                <!-- Upload Picture -->
                <div class="featured-image d-flex flex-column justify-content-center align-items-center" id="js-featured-background" style="background-image: url(<?php echo (get_user_blog_data()['avatar']) ? get_user_blog_data()['avatar'] : ''; ?>);">

                    <label for="js-featured-image" class="featured-image__upload featured-image__btn">

                        <img src="<?php echo IMAGES; ?>/icons/uploadcloud.svg" alt="" class="featured-image__icon">

                        <p>Select a file</p>
                    
                    </label>

                    <input type="file" name="featuredImage" id="js-featured-image" class="d-none" onchange="readURL(this);">

                </div>

                <div for="profile" class="profile">Profile Picture</div>

            </div>

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group">

                <div class="d-flex flex-column form-group doctor-dashboard__bio-edit-input-title">

                    <label for="title" class="form-group__title">First Name</label>

                    <input class="" type="text" name="user_firstname" id="user_firstname" value="<?php echo (get_user_blog_data()['profile']->user_firstname) ? get_user_blog_data()['profile']->user_firstname : ''; ?>" disabled="disabled">

                </div>

                <div class="d-flex flex-column form-group doctor-dashboard__bio-edit-input-subtitle">

                    <label for="subtitle" class="form-group__title">Last Name</label>

                    <input class="" type="text" name="user_lastname" id="user_lastname" value="<?php echo (get_user_blog_data()['profile']->user_lastname) ? get_user_blog_data()['profile']->user_lastname : ''; ?>" disabled="disabled">

                </div>

            </div>

        </div>

        <div class="group-profile">
            <p class="form-aclaration">Upload a photo and our team will design it in a variety of color backgrounds for you to choose from for your profile picture.</p>
        </div>

        <!-- Group Specialties -->
        <div class="doctor-dashboard__bio-edit-group group-specialties d-flex flex-column">

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group group-bios__body d-flex flex-column form-group mb-4">
                
                <label for="user_description_link">NPI#</label>

                <input type="text" name="user_npi" id="user_npi" class="input" placeholder="NPI# (If N/A, please provide alternative verification)" autocomplete="off">

            </div>

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group group-specialties-sub d-flex">

                <div class="d-flex flex-column form-group">

                    <label for="title" class="form-group__title">Specialty</label>

                    <select class="form-group__select" id="user_specialty" onchange="loadSubSpecialties( this.value );">
                        <option value="">Select Specialty</option>
                        <?php if (Blog_BioEdit::get_specialties()): 
                                foreach (Blog_BioEdit::get_specialties() as $specialty): ?>
                                    <option value="<?php echo $specialty; ?>"><?php echo $specialty; ?></option>
                        <?php endforeach;
                        endif; ?>
                        <option value="other">Other</option>
                    </select>

                </div>

                <div class="d-flex flex-column form-group">

                    <label for="title" class="form-group__title">Sub Specialty</label>

                    <select class="form-group__select" id="user_subspecialty" onchange="addSpecialties();">

                        <?php echo Blog_BioEdit::get_subspecialties(get_user_blog_data()['acf']['specialty'], get_user_blog_data()['acf']['subspecialty']); ?>

                    </select>

                </div>

                <div class="cta-add-specialties">
                    <a href="javascript:;" onclick="addSpecialties();">Add +</a>
                </div>

            </div>

            <div class="other-add-specialties" id="js-other-specialty">
                <input type="text" name="other_specialty" id="other_specialty">
                <div class="cta-add-specialties">
                    <a href="javascript:;" onclick="addOtherSpecialties();">Add +</a>
                </div>
            </div>

            <p class="text-muted mb-3">The first specialty will be displayed in your profile as the main specialty</p>

            <ul class="doctor-dashboard__bio-edit-sub-group d-flex flex-column" id="js-list-specialties">

                <?php if (get_user_blog_data()['acf']['specialty']): ?>

                    <?php foreach (get_user_blog_data()['acf']['specialty'] as $specialty): ?>

                        <li id="<?php echo str_replace(' ', '-', $specialty['specialty']); ?>" class="d-flex flex-row check_specialty">

                            <div class="box-specialty box-specialty-purple d-flex flex-row">

                                <?php echo $specialty['specialty']; ?>

                                <input type="hidden" value="<?php echo $specialty['specialty']; ?>" class="item_specialty">

                                <div onclick="deleteItemSpecialty(this);">

                                    <img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg">

                                </div>

                            </div>

                            <?php if ($specialty['subspecialty']): ?>

                                <div id="<?php echo str_replace(' ', '-', $specialty['subspecialty']); ?>" class="box-specialty box-specialty-pink d-flex flex-row">

                                    <?php echo $specialty['subspecialty']; ?>

                                    <input type="hidden" value="<?php echo $specialty['subspecialty']; ?>" class="item_subspecialty">

                                    <div onclick="deleteItemSubSpecialty(this);">

                                        <img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg">

                                    </div>

                                </div>

                            <?php endif;?>

                        </li>

                    <?php endforeach;?>

                <?php endif;?>

            </ul>

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group group-specialties-sub doctor-board-certification">

                <div class="group-bios__header group-bios__header-certification">

                    <h3>Board Certification(s)</h3>

                    <div class="d-flex justify-content-between">
                        <p>Are you Board Certified?</p>
                        <label><input type="checkbox" name="certification" id="js-board" onclick="activeBoard()" value="yes" <?php echo ( get_user_blog_data()['acf']['certification'] ) ? 'checked' : ''; ?>> Yes</label>
                        <label><input type="checkbox" name="certification" id="js-resident" onclick="activeResident()" value="no" <?php echo ( get_user_blog_data()['acf']['residency'] ) ? 'checked' : ''; ?>> No</label>
                    </div>

                    <div class="d-flex justify-content-between d-none" id="js-cta-resident">
                        <p>Are you a Resident?</p>
                        <label><input type="checkbox" name="certification" id="js-resident-y" onclick="activeResidentField()" value="yes" <?php echo ( get_user_blog_data()['acf']['residency'] ) ? 'checked' : ''; ?>> Yes</label>
                        <label><input type="checkbox" name="certification" id="js-resident-x" onclick="activeCredentialField()" value="no" <?php echo ( get_user_blog_data()['acf']['credential'] ) ? 'checked' : ''; ?>> No</label>
                    </div>

                </div>

                <div class="group-bios__header group-bios__header-content-certification <?php echo ( get_user_blog_data()['acf']['certification'] ) ? '' : 'd-none'; ?>" id="js-visible-certifications">

                    <h3>Select your Board Certification</h3>
                    
                    <!-- Subgroup -->
                    <div class="doctor-dashboard__bio-edit-sub-group group-specialties-sub d-flex">

                        <div class="d-flex flex-column form-group">

                            <label for="title" class="form-group__title">Specialty</label>

                            <select class="form-group__select" id="user_certification" onchange="loadSubCertification( this.value );">
                                <option value="">Select Specialty</option>
                                <?php if (Blog_BioEdit::get_specialties()):
                                    foreach (Blog_BioEdit::get_specialties() as $specialty): ?>
                                    <option value="<?php echo $specialty; ?>"><?php echo $specialty; ?></option>
                                <?php endforeach;
                                endif;?>
                                <option value="other">Other</option>
                            </select>

                        </div>

                        <div class="d-flex flex-column form-group">
                            <label for="title" class="form-group__title">Sub Specialty</label>
                            <select class="form-group__select" id="user_subcertification" onchange="addCertification();"></select>
                        </div>

                        <div class="cta-add-specialties">
                            <a href="javascript:;" onclick="addCertification();">Add +</a>
                        </div>

                    </div>

                    <ul class="doctor-dashboard__bio-edit-sub-group d-flex flex-column" id="js-list-certification">

                        <?php if (get_user_blog_data()['acf']['certification']): ?>

                            <?php foreach (get_user_blog_data()['acf']['certification'] as $certification): ?>

                                <li id="<?php echo str_replace(' ', '-', $certification['certification']); ?>" class="d-flex flex-row check_certification">

                                    <div class="box-certification box-certification-purple d-flex flex-row">

                                        <?php echo $certification['certification']; ?>

                                        <input type="hidden" value="<?php echo $certification['certification']; ?>" class="item_certification">

                                        <div onclick="deleteItemcertification(this);">

                                            <img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg">

                                        </div>

                                    </div>

                                    <?php if ($certification['subcertification']): ?>

                                        <div id="<?php echo str_replace(' ', '-', $certification['subcertification']); ?>" class="box-certification box-certification-pink d-flex flex-row">

                                            <?php echo $certification['subcertification']; ?>

                                            <input type="hidden" value="<?php echo $certification['subcertification']; ?>" class="item_subcertification">

                                            <div onclick="deleteItemSubcertification(this);">

                                                <img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg">

                                            </div>

                                        </div>

                                    <?php endif;?>

                                </li>

                            <?php endforeach;?>

                        <?php endif;?>

                    </ul>

                </div>

                <div class="group-bios__header group-bios__header-content-certification <?php echo ( get_user_blog_data()['acf']['residency'] ) ? '' : 'd-none'; ?>" id="js-visible-resident">

                    <h3>Fill in your residency program:</h3>

                    <input type="text" name="user_residency" id="user_residency" class="w-100" value="<?php echo ( get_user_blog_data()['acf']['residency'] ) ? get_user_blog_data()['acf']['residency'] : ''; ?>" placeholder="IE. Yale New Haven Hospital">                    

                </div>

                <div class="group-bios__header group-bios__header-content-certification <?php echo ( get_user_blog_data()['acf']['credential'] ) ? '' : 'd-none'; ?>" id="js-visible-credential">

                    <h3>Please list your credentials:</h3>

                    <input type="text" name="user_credential" id="user_credential" class="w-100" value="<?php echo ( get_user_blog_data()['acf']['credential'] ) ? get_user_blog_data()['acf']['credential'] : ''; ?>" placeholder="IE. Certified physician assistant">                    

                </div>

            </div>

        </div>

        <!-- Group Networks-->
        <div class="doctor-dashboard__bio-edit-group group-networks group-networks-header">
            <h3>Link To Your Other Accounts</h3>
            <p>These will feature on your public profile</p>
        </div>

        <!-- Group Networks-->
        <div class="doctor-dashboard__bio-edit-group group-networks">

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">
                    <label for="user_website" class="form-group__title">Website</label>
                    <input class="fix-input" type="text" name="user_website" id="user_website" placeholder="E.g. www.mypersonaldoctor.com" value="<?php echo (get_user_blog_data()['profile']->user_url) ? get_user_blog_data()['profile']->user_url : ''; ?>">
                </div>

                <div class="d-flex flex-column form-group">
                    <label for="user_email" class="form-group__title">Email</label>
                    <input class="" type="text" name="user_email" id="user_email" placeholder="E.g. my_mail@info.com" value="<?php echo (get_user_blog_data()['profile']->user_email) ? get_user_blog_data()['profile']->user_email : ''; ?>" disabled>
                </div>

            </div>

        </div>

        <!-- Group Networks-->
        <div class="doctor-dashboard__bio-edit-group group-networks">

            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">
                    <label for="user_facebook" class="form-group__title">Facebook</label>
                    <input class="fix-input" type="text" name="user_facebook" id="user_facebook" placeholder="E.g. https://facebook.com/myprofile" value="<?php echo (isset(get_user_blog_data()['meta']->facebook[0])) ? get_user_blog_data()['meta']->facebook[0] : ''; ?>">
                </div>

                <div class="d-flex flex-column form-group">
                    <label for="user_twitter" class="form-group__title">Twitter</label>
                    <input class="" type="text" name="user_twitter" id="user_twitter" placeholder="E.g. https://twitter.com/myprofile" value="<?php echo (isset(get_user_blog_data()['meta']->twitter[0])) ? get_user_blog_data()['meta']->twitter[0] : ''; ?>">
                </div>

            </div>

        </div>

        <!-- Group Networks-->
        <div class="doctor-dashboard__bio-edit-group group-networks group-networks-items">

            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">
                    <label for="user_instagram" class="form-group__title">Instagram</label>
                    <input class="mb-0 fix-input" type="text" name="user_instagram" id="user_instagram" placeholder="E.g. https://instagram.com/myprofile" value="<?php echo (isset(get_user_blog_data()['meta']->instagram[0])) ? get_user_blog_data()['meta']->instagram[0] : ''; ?>">
                </div>

                <div class="d-flex flex-column form-group">
                    <label for="user_linkedin" class="form-group__title">Linkedin</label>
                    <input class="mb-0" type="text" name="user_linkedin" id="user_linkedin" placeholder="E.g. https://linkedin.com/myprofile" value="<?php echo (isset(get_user_blog_data()['meta']->linkedin[0])) ? get_user_blog_data()['meta']->linkedin[0] : ''; ?>">
                </div>

            </div>

        </div>

        <!-- Group Clinic-->
        <div class="doctor-dashboard__bio-edit-group group-networks group-networks-header">
            <h3>Add your Clinic</h3>
            <p>Add your clinic data</p>
        </div>

        <!-- Group Clinic-->
        <div class="doctor-dashboard__bio-edit-group group-networks">

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">
                    <label for="clinic_name" class="form-group__title">Clinic Name</label>
                    <input class="fix-input" type="text" name="clinic_name" id="clinic_name" placeholder="E.g. Yale New Haven Hospital" value="<?php echo (get_user_blog_data()['profile']->clinic_name) ? get_user_blog_data()['profile']->clinic_name : ''; ?>">
                </div>

                <div class="d-flex flex-column form-group">
                    <label for="clinic_email" class="form-group__title">Clinic Email <span id="js-message-email" class="ml-2"></span></label>
                    <input class="" type="text" name="clinic_email" id="clinic_email"  placeholder="E.g. clinic-email@clinic.com" onkeypress="return runCheckEmail(this.value)" value="<?php echo (get_user_blog_data()['profile']->clinic_email) ? get_user_blog_data()['profile']->clinic_email : ''; ?>">
                </div>

            </div>

        </div>

        <!-- Group Clinic-->
        <div class="doctor-dashboard__bio-edit-group group-networks">

            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">
                    <label for="clinic_open" class="form-group__title">Open Time</label>
                    <input class="fix-input" type="text" name="clinic_open" id="clinic_open" placeholder="E.g. Monday to Friday from 10am to 10pm" value="<?php echo (get_user_blog_data()['acf']['clinic_open']) ? get_user_blog_data()['acf']['clinic_open'] : ''; ?>">
                </div>

                <div class="d-flex flex-column form-group">
                    <label for="clinic_phone" class="form-group__title">Clinic Phone</label>
                    <input type="text" name="clinic_phone" id="clinic_phone" placeholder="E.g. 1-0800-011-1234" onkeypress="return runCheckPhone(event)" value="<?php echo (get_user_blog_data()['acf']['clinic_phone']) ? get_user_blog_data()['acf']['clinic_phone'] : ''; ?>">
                </div>

            </div>

        </div>

        <!-- Group Clinic-->
        <div class="doctor-dashboard__bio-edit-group group-networks group-networks-items">

            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">
                    <label for="clinic_web" class="form-group__title">Clinic Website</label>
                    <input class="fix-input" type="text" name="clinic_web" id="clinic_web" placeholder="E.g. https://clinic-site.com" value="<?php echo (get_user_blog_data()['acf']['clinic_website']) ? get_user_blog_data()['acf']['clinic_website']: ''; ?>">
                </div>

                <div class="d-flex flex-column form-group">
                    <label for="clinic_appointment" class="form-group__title">Appointment Booking Site</label>
                    <input type="text" name="clinic_appointment" id="clinic_appointment" placeholder="E.g. https://my-site.com" value="<?php echo (get_user_blog_data()['acf']['clinic_appointment']) ? get_user_blog_data()['acf']['clinic_appointment']: ''; ?>">
                    <input id="latitud_prop" placeholder="Latitud" name="latitud" value="0" hidden>
                    <input id="longitud_prop" placeholder="Longitud" name="longitud" value="0" hidden>
                    <input id="city_prop" placeholder="city" name="city" value="" hidden>
                    <input id="state_prop" placeholder="state" name="state" value="" hidden>
                    <input id="country_prop" placeholder="country" name="country" value="" hidden>
                    <input id="js-google-search" type="text" name="clinic_location" class="mb-0 search-input-map" placeholder="Enter a location" value="<?php echo (get_user_blog_data()['acf']['clinic_location']) ? get_user_blog_data()['acf']['clinic_location']['address'] : ''; ?>" size="50">
                </div>

            </div>

            <div class="doctor-dashboard__bio-edit-sub-group d-flex">

                <div class="d-flex flex-column form-group">

                    <label for="subtitle" class="form-group__title mb-0">Clinic Location</label>

                    <div class="acf-map" id="map" data-zoom="16">

                        <?php $location = get_user_blog_data()['acf']['clinic_location']; ?>

                        <?php if ( $location ) : ?>

                            <div class="marker" data-lat="<?php echo esc_attr( $location['lat'] ); ?>" data-lng="<?php echo esc_attr( $location['lng'] ); ?>"></div>
                            
                        <?php else: ?>

                            <div class="marker" data-lat="40.71427" data-lng="-74.00597"></div>
                        
                        <?php endif; ?>

                    </div>

                </div>

            </div>

        </div>

        <!-- Group Bios -->
        <div class="doctor-dashboard__bio-edit-group group-bios">

            <div class="group-bios__header">

                <h3>My Bio</h3>

                <p>Write a short bio that will be featured on your public profile.</p>

                <span id="charNum" class="text-min text-right d-block w-100 pb-1">0 out of 500 characters</span> 

            </div>

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group group-bios__body d-flex flex-column form-group">

                <textarea name="user_description" id="user_description" onkeyup="countChars(this);" placeholder="E.g. Cardiovascular and Structural Heart  Interventional Physician with Boards in Internal Medicine, Cardiovascular Medicine, Nuclear Cardiology and Interventional Cardiology"><?php echo (get_user_blog_data()['acf']['biography']) ? get_user_blog_data()['acf']['biography'] : ''; ?></textarea>

                <label class="mt-5" for="user_description_link">External Link Bio</label>

                <input type="text" name="user_description_link" id="user_description_link" class="mr-0 certification-item" placeholder="E.g. https://my-web.com" value="<?php echo get_user_blog_data()['acf']['biography_link']; ?>">

            </div>

        </div>

        <!-- Group Education -->
        <div class="doctor-dashboard__bio-edit-group group-certification">

            <div class="group-bios__header group-bios__header-education">

                <h3>Education</h3>

                <p>Fill in your education so that users can see your qualifications.</p>

            </div>

            <div class="doctor-dashboard__bio-edit-sub-group d-flex flex-column form-group">

                <label for="title" class="form-group__title">Education</label>

                <input type="text" name="user_education" id="user_education" class="mr-0 certification-item">

                <div class="group-certification-cta">

                    <a href="javascript:;" onclick="addEducationItem();">Save +</a>

                </div>

                <ul class="doctor-dashboard__bio-edit-sub-group d-flex flex-column" id="js-list-education">

                    <?php if ( get_user_blog_data()['acf']['education'] ) : ?>

                        <?php foreach( get_user_blog_data()['acf']['education'] as $key => $c ) : ?>

                            <li id="<?php echo str_replace(' ', '-', $c['education']); ?>" class="d-flex flex-row check_education">

                                <div class="box-education box-education-purple d-flex flex-row">

                                    <?php echo $c['education']; ?>

                                    <input type="hidden" value="<?php echo $c['education']; ?>" class="item_education">

                                    <div onclick="deleteItemEducation(this);">

                                        <img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg">

                                    </div>

                                </div>
                            
                            </li>

                        <?php endforeach; ?>

                    <?php endif; ?>

                </ul>

            </div>

        </div>

        <!-- Group Area of Expertice -->
        <div class="doctor-dashboard__bio-edit-group group-certification">

            <div class="group-bios__header group-bios__header-education">

                <h3>Areas of Expertise</h3>

                <p>Here is where you can list your areas of interest, the conditions you treat, the procedures you perform, the services you provide - anything that you'd like to be known for to help users find your profile.</p>

            </div>

            <div class="doctor-dashboard__bio-edit-sub-group d-flex flex-column form-group">

                <input type="text" name="user_expertise" id="user_expertise" placeholder="E.g. Kidney Health, Diabetes, Colonoscopy, Bariatric Surgery, etc." class="mr-0 certification-item">

                <div class="group-certification-cta">

                    <a href="javascript:;" onclick="addExpertiseItem();">Save +</a>

                </div>

                <ul class="doctor-dashboard__bio-edit-sub-group d-flex flex-column" id="js-list-expertise">

                    <?php if ( get_user_blog_data()['acf']['expertise'] ) : ?>

                        <?php foreach( get_user_blog_data()['acf']['expertise'] as $key => $c ) : ?>

                            <li id="<?php echo str_replace(' ', '-', $c['expertise']); ?>" class="d-flex flex-row check_expertise">

                                <div class="box-education box-education-purple d-flex flex-row">

                                    <?php echo $c['expertise']; ?>

                                    <input type="hidden" value="<?php echo $c['expertise']; ?>" class="item_education">

                                    <div onclick="deleteExpertiseItem(this);">

                                        <img src="/wp-content/plugins/blogging-platform/assets/img/delete-x-icon.svg">

                                    </div>

                                </div>
                            
                            </li>

                        <?php endforeach; ?>

                    <?php endif; ?>

                </ul>

            </div>

        </div>

        <!-- Group CTA -->
        <div class="doctor-dashboard__bio-edit-group doctor-dashboard__bio-edit__preview w-100">

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group doctor-dashboard__bio-edit__preview__content form-group">

                <?php if (!is_page('bio-edit')): ?>

                    <a href="<?php echo get_user_blog_data()['link']; ?>" type="button" class="skipe-steps ml-auto" id="js-skip-step">Skip Step</a>

                <?php endif;?>

                <button type="button" onclick="FormCompleteBioSubmit()" class="btn btn-primary ml-auto  btn-save js-save-animation">Save Profile</button>

            </div>

        </div>

        <!-- Group Messages -->
        <div class="doctor-dashboard__bio-edit-group doctor-dashboard__bio-edit__preview mt-2 w-100">

            <div id="js-bio-edit-msj" class="text-right"></div>

        </div>

    </div>

    <div class="doctor-dashboard__bio-edit__stiky">

        <div class="doctor-dashboard__bio-edit__stiky__container">

            <div class="doctor-dashboard__bio-edit__stiky__container__box">

                <?php echo do_shortcode('[video src="' . WPBD_URL . '/assets/video/scroll-profile.mp4" loop="true" width="185px"]'); ?>

            </div>

        </div>

    </div>

</form>

<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php echo GMAPS_API_KEY; ?>&libraries=places"></script>
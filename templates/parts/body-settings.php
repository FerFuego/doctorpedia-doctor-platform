<div class="doctor-dashboard__bio-edit doctor-dashboard__bio-edit__settings d-flex flex-row flex-wrap mt-0" id="js-bios-edit-filters">

    <form class="doctor-dashboard__bio-edit__settings" id="js_form_bio_edit" enctype="multipart/form-data">

        <h3>Change Password</h3>

        <!-- Group -->
        <div class="doctor-dashboard__bio-edit-group mt-4 d-flex justify-content-between">

            <div class="d-flex flex-column form-group form-group__settings">

                <label for="subtitle" class="form-group__title">Email</label>

                <input class="input--md" type="text" name="user_email" id="user_email" value="<?php echo ( get_user_blog_data()['profile']->user_email ) ? get_user_blog_data()['profile']->user_email : ''; ?>" disabled>

            </div>

            <div class="d-flex flex-column form-group form-group__settings">

                <label for="title" class="form-group__title">Password</label>

                <input class="input--md" type="password" name="user_password" id="user_password">

            </div>


            <div class="d-flex flex-column form-group form-group__settings">

                <label for="subtitle" class="form-group__title">Confirm Password</label>

                <input class="input--md" type="password" name="user_confirm" id="user_confirm">

            </div>

        </div>

        <!-- Group -->
        <div class="doctor-dashboard__bio-edit-group mt-4 w-100">

            <!-- Subgroup -->
            <div class="doctor-dashboard__bio-edit-sub-group d-flex flex-row form-group">

                <div id="js-settings-msj"></div>
                
                <button type="button" onclick="FormSettingSubmit()" class="btn btn-primary ml-auto btn-save js-save-animation">Update</button>

            </div>

        </div>

    </form>

</div>
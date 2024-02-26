<div class="shadow doctors-shadow d-none" id="js-insert-articles-img-modal">

    <div class="doctors-add-review-modal modal-articles_img mb-5">

        <div class="doctors-add-review-modal__header modal-articles_img__header d-flex justify-content-between align-items-center pl-lg-5 pr-lg-5">

            <h1 class="doctors-add-review-modal__title modal-articles_img__title">Select Featured Image</h1>

            <button type="button" onclick="$('#js-insert-articles-img-modal').addClass('d-none');" class="close-modal"> <img src="<?php echo IMAGES; ?>/icons/close-modal.svg" alt=""></button>

        </div>

        <div class="doctors-add-review-modal__box">

            <p class="modal-articles_img__copy">Your blog/article needs a featured image. You can select one from our curated collection of free use high quality images. If you don't select one, we'll do that for you.</p>

            <div class="modal-articles_img__picture-container d-flex flex-md-row flex-column flex-wrap">

                <?php
                    /* $dir = PLUGIN_BASEPATH . 'gallery/';

                    $images = glob("$dir{*.gif,*.JPG,*.jpg,*.jpeg,*.png}", GLOB_BRACE);  

                    foreach ( $images as $image ) : 

                        $link = plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/' . end( explode('/', $image) ); ?>

                        <div 
                            class="modal-articles_img__picture"
                            onclick="setImageArticle( '<?php echo $link; ?>' )"
                            style="background-color: grey; cursor:pointer; background-image: url( <?php echo $link; ?> )"
                        ></div>

                <?php endforeach; */ ?>
                
                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/1.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/1.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/1-Coffee.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/1-Coffee.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/2.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/2.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/2-Protein-Shake.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/2-Protein-Shake.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/3.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/3.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/4.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/4.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/5.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/5.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/6.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/6.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/7.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/7.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/8.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/8.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/9.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/9.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/10.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/10.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/11.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/11.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/12.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/12.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/13.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/13.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/14.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/14.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/15.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/15.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/16.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/16.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/17.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/17.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/18.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/18.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/19.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/19.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/20.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/20.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/21.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/21.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/22.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/22.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/23.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/23.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/24.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/24.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/25.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/25.jpg';?>)"
                ></div>

                <div 
                    class="modal-articles_img__picture"
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/26.jpg';?>' )"
                    style="background-color: grey; cursor:pointer; background-image: url(<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/26.jpg';?>)"
                ></div>
                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Apple-Watch.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Apple-Watch.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Brain.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Brain.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Cataract-Surgery-Overview.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Cataract-Surgery-Overview.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Channels.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Channels.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Concussion.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Concussion.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Desk.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Desk.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-Phone.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-Phone.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-Showing-Patient-iPad.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-Showing-Patient-iPad.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-With-Kid-and-Mom.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-With-Kid-and-Mom.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-and-Patient-At-Desk.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Doctor-and-Patient-At-Desk.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Genetics.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Genetics.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Genomic-Cancer-Profiler-Receives-FDA-Approval.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Genomic-Cancer-Profiler-Receives-FDA-Approval.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Gut-Healthy-Plant-Based-Diets-For-Heart-Health.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Gut-Healthy-Plant-Based-Diets-For-Heart-Health.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Having-Good-Sleep-Hygiene-For-Better-Sleep.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Having-Good-Sleep-Hygiene-For-Better-Sleep.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/How-Caffeine-May-Be-Affecting-Your-Mental-Health.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/How-Caffeine-May-Be-Affecting-Your-Mental-Health.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Is-Home-Infusion-of-Cancer-Drugs-a-Good-Idea.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Is-Home-Infusion-of-Cancer-Drugs-a-Good-Idea.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Measles-and-Rubella-Around-The-World.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Measles-and-Rubella-Around-The-World.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Off-and-Running-Top-Tech-For-2020-Runners.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Off-and-Running-Top-Tech-For-2020-Runners.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Running.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Running.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/The-Scientific-Basis-For-Functional-Medicine-Principles.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/The-Scientific-Basis-For-Functional-Medicine-Principles.jpg'; ?> )"
                ></div>

                <div 
                    class="modal-articles_img__picture" 
                    onclick="setImageArticle( '<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Whats-So-Super-About-Superfoods.jpg'; ?>' )" 
                    style="background-color: grey; cursor:pointer; background-image: url( <?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../gallery/Whats-So-Super-About-Superfoods.jpg'; ?> )"
                ></div>

            </div>

        </div>

    </div>

</div>